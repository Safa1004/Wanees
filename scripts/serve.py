#!/usr/bin/env python3
"""Local-only static server and same-origin .NET proxy. No browser data is persisted here."""
import http.server, http.client, pathlib, subprocess, os, signal, sys, threading, time, webbrowser, json, secrets, hashlib, shutil, socket
ROOT=pathlib.Path(__file__).resolve().parents[1]
WEB_PORT=int(os.environ.get('WANEES_WEB_PORT','5180'))
API_PORT=int(os.environ.get('WANEES_API_PORT','0'))
if API_PORT==0:
 with socket.socket() as api_probe:
  api_probe.bind(('127.0.0.1',0));API_PORT=api_probe.getsockname()[1]
API=ROOT/'apps/api/publish/Wanees.Api.dll'
if not API.exists() or not (ROOT/'apps/web/dist/index.html').exists():
 sys.exit('Built files are missing. See README.md for build instructions.')
# Check before touching database state: a second launch must never stop the first.
for port in (WEB_PORT,API_PORT):
 probe=socket.socket()
 try:probe.bind(('127.0.0.1',port))
 except OSError:
  if port==WEB_PORT:
   print(f'Wanees or another app is already using http://127.0.0.1:{WEB_PORT}/. Close its Terminal window before starting another copy.',flush=True)
   if '--no-browser' not in sys.argv:webbrowser.open(f'http://127.0.0.1:{WEB_PORT}/')
   sys.exit(0)
  sys.exit(f'The API port {API_PORT} is already in use. Stop the earlier Wanees instance first.')
 finally:probe.close()
env=os.environ.copy();env['DOTNET_USE_POLLING_FILE_WATCHER']='1';env['DOTNET_CLI_TELEMETRY_OPTOUT']='1';env['DemoMode']='true' if '--file-demo' in sys.argv or '--demo' in sys.argv else 'false';env['LocalHttp']='true'
env['DemoDataPath']=str(ROOT/'local-data/synthetic-demo.json')
env['AllowFileDemo']='true' if '--file-demo' in sys.argv else 'false'
(ROOT/'local-data').mkdir(exist_ok=True)
db_container = None
db_started_by_this_run = False
if '--file-demo' not in sys.argv:
 if not shutil.which('docker'):
  sys.exit('Docker Desktop is required for PostgreSQL. Start Docker and try again. An explicit synthetic-file mode is available with --file-demo.')
 try:
  subprocess.run(['docker','info','--format','{{.ServerVersion}}'],check=True,capture_output=True,timeout=15)
  suffix=hashlib.sha256(str(ROOT).encode()).hexdigest()[:10]
  db_container='wanees-postgres-'+suffix
  credential=ROOT/'local-data/postgres-password'
  exists=subprocess.run(['docker','inspect',db_container],capture_output=True).returncode==0
  if not credential.exists():
   if exists:sys.exit('The local database exists but its password file is missing. Restore local-data/postgres-password from your local backup.')
   credential.write_text(secrets.token_hex(32));credential.chmod(0o600)
  password=credential.read_text().strip()
  if exists:
   was_running=json.loads(subprocess.check_output(['docker','inspect',db_container]))[0]['State']['Running']
  else:was_running=False
  db_started_by_this_run=not was_running
  if not exists:
   db_env=os.environ.copy();db_env['POSTGRES_PASSWORD']=password
   subprocess.run(['docker','run','-d','--name',db_container,'--label','app=wanees','-e','POSTGRES_USER=wanees','-e','POSTGRES_DB=wanees','-e','POSTGRES_PASSWORD','-p','127.0.0.1::5432','-v',db_container+'-data:/var/lib/postgresql','postgres:18'],env=db_env,check=True)
  else:subprocess.run(['docker','start',db_container],check=True,capture_output=True)
  for _ in range(60):
   if subprocess.run(['docker','exec',db_container,'pg_isready','-U','wanees','-d','wanees'],capture_output=True).returncode==0:break
   time.sleep(.5)
  else:sys.exit('PostgreSQL did not become ready. Review Docker Desktop.')
  info=json.loads(subprocess.check_output(['docker','inspect',db_container]))[0]
  db_port=info['NetworkSettings']['Ports']['5432/tcp'][0]['HostPort']
  env['ConnectionStrings__Postgres']=f'Host=127.0.0.1;Port={db_port};Database=wanees;Username=wanees;Password={password}'
  env['MigrateOnStartup']='true'
 except (subprocess.SubprocessError, OSError) as error:
  sys.exit('PostgreSQL could not start. Check that Docker Desktop is running. '+str(error))
if '--create-admin' in sys.argv:
 import getpass
 if env['DemoMode']=='true':sys.exit('Administrator creation requires PostgreSQL account mode.')
 env['WANEES_ADMIN_EMAIL']=input('Administrator email: ').strip()
 env['WANEES_ADMIN_PASSWORD']=getpass.getpass('New password (12+ characters, mixed case, number and symbol): ')
 if env['WANEES_ADMIN_PASSWORD']!=getpass.getpass('Confirm password: '):sys.exit('Passwords did not match.')
 result=subprocess.run(['dotnet',str(API),'--create-admin'],cwd=ROOT/'apps/api/publish',env=env)
 if db_started_by_this_run and db_container:subprocess.run(['docker','stop',db_container],capture_output=True)
 sys.exit(result.returncode)
api=subprocess.Popen(['dotnet',str(API),'--urls',f'http://127.0.0.1:{API_PORT}'],cwd=ROOT/'apps/api/publish',env=env)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT/'apps/web/dist'),**kw)
 def log_message(self,format,*args):pass
 def list_directory(self,path):
  self.send_error(404);return None
 def end_headers(self):
  if not self.path.startswith('/api/'):
   self.send_header('X-Content-Type-Options','nosniff')
   self.send_header('X-Frame-Options','DENY')
   self.send_header('Referrer-Policy','same-origin')
   self.send_header('Permissions-Policy','camera=(), microphone=(), geolocation=()')
   self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'")
   self.send_header('Cache-Control','public, max-age=31536000, immutable' if self.path.startswith('/assets/') else 'no-cache')
  super().end_headers()
 def proxy(self):
  lengths=self.headers.get_all('Content-Length',[])
  if self.headers.get('Transfer-Encoding') or len(lengths)>1:
   self.close_connection=True;self.send_error(400);return
  try:length=int(lengths[0]) if lengths else 0
  except ValueError:self.close_connection=True;self.send_error(400);return
  if length<0:self.close_connection=True;self.send_error(400);return
  if length>65536:self.send_error(413);return
  body=self.rfile.read(length) if length else None
  connection=http.client.HTTPConnection('127.0.0.1',API_PORT,timeout=200)
  headers={k:v for k,v in self.headers.items() if k.lower() not in ('host','connection','transfer-encoding','forwarded','x-forwarded-for','x-forwarded-proto','x-forwarded-host')};headers['Host']=f'127.0.0.1:{API_PORT}'
  try:
   connection.request(self.command,self.path,body,headers);response=connection.getresponse()
   if response.getheader('Content-Type','').startswith('application/x-ndjson'):
    self.close_connection=True;self.send_response(response.status)
    for k,v in response.getheaders():
     if k.lower() not in ('transfer-encoding','connection','content-length'):self.send_header(k,v)
    self.end_headers()
    while chunk:=response.read1(8192):
     self.wfile.write(chunk);self.wfile.flush()
    return
   data=response.read();self.send_response(response.status)
   for k,v in response.getheaders():
    if k.lower() not in ('transfer-encoding','connection','content-length'):self.send_header(k,v)
   self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  except (BrokenPipeError,ConnectionResetError):pass
  except (OSError,http.client.HTTPException):
   data=json.dumps({'title':'The local API is unavailable','status':503}).encode();self.send_response(503);self.send_header('Content-Type','application/problem+json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  finally:connection.close()
 def do_GET(self):
  if self.path.startswith(('/api/','/openapi/')):return self.proxy()
  if not pathlib.Path(self.translate_path(self.path)).is_file() and '.' not in self.path.rsplit('/',1)[-1]:self.path='/index.html'
  return super().do_GET()
 def do_POST(self):self.proxy() if self.path.startswith('/api/') else self.send_error(405)
 def do_PUT(self):self.proxy() if self.path.startswith('/api/') else self.send_error(405)
 def do_DELETE(self):self.proxy() if self.path.startswith('/api/') else self.send_error(405)
try:
 server=http.server.ThreadingHTTPServer(('127.0.0.1',WEB_PORT),Handler)
 def ready():
  for _ in range(60):
   if api.poll() is not None:return
   try:
    c=http.client.HTTPConnection('127.0.0.1',API_PORT,timeout=1);c.request('GET','/api/health');r=c.getresponse();ok=r.status==200;c.close()
    if ok:
     print(f'\nWanees is ready: http://127.0.0.1:{WEB_PORT}/\nKeep this window open. Press Control+C to stop.\n',flush=True)
     if '--no-browser' not in sys.argv:webbrowser.open(f'http://127.0.0.1:{WEB_PORT}/')
     return
   except OSError:pass
   time.sleep(.5)
  print('The API did not start. Review the error above.',flush=True)
 threading.Thread(target=ready,daemon=True).start();server.serve_forever()
except KeyboardInterrupt:print('\nStopping Wanees.')
finally:
 api.terminate()
 try:api.wait(timeout=5)
 except subprocess.TimeoutExpired:api.kill()
 if db_container and db_started_by_this_run:subprocess.run(['docker','stop',db_container],capture_output=True)
