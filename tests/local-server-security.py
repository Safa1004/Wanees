"""Exercise the real local proxy handler without starting the app/database."""
import pathlib,http.server,http.client,threading,tempfile,json
root=pathlib.Path(__file__).resolve().parents[1]
source=(root/'scripts/serve.py').read_text()
handler=source[source.index('class Handler('):source.index('\ntry:\n server=')]
gate=threading.Event()
class Provider(http.server.BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  self.send_response(200);self.send_header('Content-Type','application/x-ndjson');self.end_headers()
  self.wfile.write(b'{"type":"delta","text":"Hello"}\n');self.wfile.flush()
  gate.wait(3)
  self.wfile.write(b'{"type":"complete"}\n');self.wfile.flush()
provider=http.server.ThreadingHTTPServer(('127.0.0.1',0),Provider)
threading.Thread(target=provider.serve_forever,daemon=True).start()
namespace=dict(http=http,ROOT=root,API_PORT=provider.server_port,pathlib=pathlib,json=json)
exec(handler,namespace)
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),namespace['Handler'])
threading.Thread(target=server.serve_forever,daemon=True).start()
def req(method,path,headers=None):
 c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=3)
 c.request(method,path,headers=headers or {});r=c.getresponse();r.read();c.close();return r
try:
 for value in ['-1','invalid','65537']:
  r=req('POST','/api/v1/anything',{'Content-Length':value})
  assert r.status==(413 if value=='65537' else 400)
 assert req('POST','/api/v1/anything',{'Transfer-Encoding':'chunked'}).status==400
 r=req('GET','/');assert r.status==200
 assert r.getheader('X-Frame-Options')=='DENY'
 assert "'wasm-unsafe-eval'" in r.getheader('Content-Security-Policy')
 assert r.getheader('Cache-Control')=='no-cache'
 asset=next((root/'apps/web/dist/assets').glob('*.js'))
 assert 'immutable' in req('GET','/assets/'+asset.name).getheader('Cache-Control')
 c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=2)
 c.request('GET','/api/stream');r=c.getresponse()
 assert json.loads(r.readline())['type']=='delta'
 gate.set();assert json.loads(r.readline())['type']=='complete';c.close()
 print('PASS streaming proxy forwards first chunk before provider finishes')
 print('PASS malformed/negative/oversize bodies, unsupported chunking, CSP, frame protection and asset caching')
finally:gate.set();server.shutdown();server.server_close();provider.shutdown();provider.server_close()
