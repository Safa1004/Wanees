#!/usr/bin/env python3
"""Integration checks: real PostgreSQL + Identity, deterministic private model fixture.
Requires published API, Docker, .NET. Creates an isolated temporary test container.
No real patient data. Model quality is tested separately, never by this fixture.
"""
import subprocess, os, pathlib, secrets, json, time, urllib.request, urllib.error, http.cookiejar, http.server, threading, socket, tempfile, shutil
ROOT = pathlib.Path(__file__).resolve().parents[1]
passed=[]
def check(value, name):
    assert value, name
    passed.append(name); print('PASS', name, flush=True)
def freeport():
    with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
class Model(http.server.BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def do_POST(self):
        if self.headers.get('Transfer-Encoding') == 'chunked':
            chunks=[]
            while True:
                size=int(self.rfile.readline().strip().split(b';')[0],16)
                if size==0:self.rfile.readline();break
                chunks.append(self.rfile.read(size));self.rfile.read(2)
            data=b''.join(chunks)
        else:data=self.rfile.read(int(self.headers['Content-Length']))
        d=json.loads(data)
        assert d['messages'][0]['role']=='system' and d['think'] is False
        if d['messages'][-1]['content']=='simulate-unavailable':
            self.send_response(503);self.end_headers();return
        if d.get('stream'):
            self.send_response(200);self.send_header('Content-Type','application/x-ndjson');self.end_headers()
            self.wfile.write(json.dumps({'message':{'content':'Hello friend.'},'done':False}).encode()+b'\n');self.wfile.flush()
            if d['messages'][-1]['content']!='simulate-interrupted':self.wfile.write(b'{"done":true}\n')
            return
        answer={'message':{'content':'Let us imagine a little boat on a quiet sea. What colour would you choose?'}}
        b=json.dumps(answer).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(b)
class Client:
    def __init__(self, base):self.base=base;self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
    def req(self,path,method='GET',body=None,csrf=True):
        data=None if body is None else json.dumps(body).encode();h={'Content-Type':'application/json'}
        if method!='GET' and csrf:h['X-CSRF-TOKEN']=self.csrf
        try:r=self.opener.open(urllib.request.Request(self.base+path,data,headers=h,method=method),timeout=30)
        except urllib.error.HTTPError as e:r=e
        b=r.read()
        try:b=json.loads(b)
        except (ValueError,UnicodeDecodeError):pass
        return r.status,b
    def token(self):self.csrf=self.req('/session')[1]['csrf']
    def login(self,email,password):
        self.token();r=self.req('/auth/login','POST',{'email':email,'password':password});self.token();return r
name='wanees-accounts-test-'+secrets.token_hex(4);password=secrets.token_hex(24)+'Aa!';port=freeport();modelport=freeport();api=None
model=http.server.ThreadingHTTPServer(('127.0.0.1',modelport),Model);threading.Thread(target=model.serve_forever,daemon=True).start()
work=pathlib.Path(tempfile.mkdtemp(prefix='wanees-accounts-test-'))
try:
    env=os.environ.copy();env['POSTGRES_PASSWORD']=password
    subprocess.run(['docker','run','-d','--name',name,'-e','POSTGRES_PASSWORD','-e','POSTGRES_USER=wanees','-e','POSTGRES_DB=wanees','-p','127.0.0.1::5432','postgres:18'],env=env,check=True,stdout=subprocess.DEVNULL)
    for _ in range(90):
        if subprocess.run(['docker','exec',name,'pg_isready','-U','wanees'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:break
        time.sleep(.5)
    dbport=json.loads(subprocess.check_output(['docker','inspect',name]))[0]['NetworkSettings']['Ports']['5432/tcp'][0]['HostPort']
    env.update(ConnectionStrings__Postgres=f'Host=127.0.0.1;Port={dbport};Database=wanees;Username=wanees;Password={password}',DemoMode='false',LocalHttp='true',MigrateOnStartup='true',DOTNET_USE_POLLING_FILE_WATCHER='1',WANEES_ADMIN_EMAIL='admin@example.test',WANEES_ADMIN_PASSWORD=password,AI__ChatUrl=f'http://127.0.0.1:{modelport}')
    dll=str(ROOT/'apps/api/publish/Wanees.Api.dll')
    with (work/'api.log').open('w') as log:
        subprocess.run(['dotnet',dll,'--create-admin'],cwd=work,env=env,stdout=log,stderr=log,check=True)
        api=subprocess.Popen(['dotnet',dll,'--urls',f'http://127.0.0.1:{port}'],cwd=work,env=env,stdout=log,stderr=log)
        base=f'http://127.0.0.1:{port}/api/v1';a=Client(base);b=Client(base);admin=Client(base)
        for _ in range(80):
            try:a.token();break
            except OSError:time.sleep(.25)
        check(a.req('/admin/users')[0]==401,'anonymous cannot read accounts')
        check(a.req('/auth/register','POST',{'email':'a@example.test','password':password,'consent':True},False)[0]==400,'registration requires CSRF')
        for c,email in [(a,'a@example.test'),(b,'b@example.test')]:
            c.token();check(c.req('/auth/register','POST',{'email':email,'password':password,'consent':True,'role':'PlatformAdmin'})[0]==200,'account registration '+email)
            check(c.login(email,password)[0]==200,'password sign-in '+email)
            check(c.req('/session')[1]['role']=='Guardian','registration cannot choose privileged roles')
        check(a.req('/admin/users')[0]==403,'parent cannot enumerate user accounts')
        check(a.req('/records/profiles','POST',{'data':{'nickname':12}})[0]==400,'numeric nickname rejected without server error')
        check(a.req('/records/appointments','POST',{'data':{'date':12,'time':'10:00'}})[0]==400,'numeric appointment date rejected')
        check(a.req('/records/notes','POST',{'data':{'profileId':12}})[0]==400,'numeric profile reference rejected')
        profile=a.req('/records/profiles','POST',{'data':{'nickname':'Fictional child'}})[1]
        check(b.req('/records/profiles/'+profile['id'],'DELETE')[0]==404,'child profiles isolated between families')
        check(a.req('/chat/conversations','POST',{'character':'Maryam','language':'en','adultConsent':False})[0]==400,'chat requires adult consent')
        conv=a.req('/chat/conversations','POST',{'character':'Maryam','language':'en','adultConsent':True})[1]
        route='/chat/conversations/'+conv['id']
        check(b.req(route+'/messages','POST',{'text':'hello','version':1})[0]==404,'other account cannot send into conversation')
        result=a.req(route+'/messages','POST',{'text':'Tell me a story','version':1})
        check(result[0]==200 and len(result[1]['conversation']['messages'])==2,'chat persists user and model replies through private provider')
        check(a.req(route+'/messages','POST',{'text':'simulate-unavailable','version':2})[0]==503,'model failure returns honest unavailable response')
        check(len(a.req('/chat/conversations')[1][0]['conversation']['messages'])==2,'failed model call does not save a pretend reply')
        check(a.req(route+'/messages','POST',{'text':'hello','version':1})[0]==409,'stale conversation version rejected')
        check(b.req(route,'DELETE')[0]==404,'other account cannot delete conversation')
        message=result[1]['conversation']['messages'][1]['id']
        check(b.req(route+'/audio/'+message)[0]==404,'voice access bound to conversation owner')
        streamed=a.req(route+'/messages','POST',{'text':'Stream a story','version':2,'stream':True})
        events=[json.loads(line) for line in streamed[1].splitlines()]
        check(streamed[0]==200 and events[1]['type']=='delta' and events[-1]['type']=='complete','stream delivers deltas then persisted completion')
        interrupted=a.req(route+'/messages','POST',{'text':'simulate-interrupted','version':3,'stream':True})
        check(json.loads(interrupted[1].splitlines()[-1])['type']=='error','truncated provider stream reports an error')
        check(len(a.req('/chat/conversations')[1][0]['conversation']['messages'])==4,'interrupted stream does not persist partial history')
        check(a.req(route+'/audio/'+message)[0]==503,'unconfigured voice fails explicitly')
        check(admin.login('admin@example.test',password)[0]==200,'bootstrap administrator signs in')
        people=admin.req('/admin/users')[1];uid=next(u['id'] for u in people if u['email']=='b@example.test')
        check(admin.req('/admin/users/'+uid+'/role','PUT',{'role':'Editor','hospital':'al-bahar'})[0]==204,'platform admin assigns staff role')
        check(b.req('/records/profiles')[0]==401,'role change revokes old session')
        check(b.login('b@example.test',password)[0]==200 and b.req('/session')[1]['role']=='Editor','login respects saved role')
        check(b.req('/admin/users')[0]==403,'editor cannot manage accounts')
        check(b.req('/staff/content','POST',{'hospitalId':'other','title':'Test','body':'Test','language':'en'})[0]==403,'staff hospital boundary enforced')
        content=b.req('/staff/content','POST',{'hospitalId':'al-bahar','title':'Fictional content','body':'Ask your adult.','language':'en'})[1]
        content=b.req('/staff/content/'+content['id']+'/transition','POST',{'status':'in-review','version':1})[1]
        admin.req('/admin/users/'+uid+'/role','PUT',{'role':'Reviewer','hospital':'al-bahar'});b.login('b@example.test',password)
        check(b.req('/staff/content/'+content['id']+'/transition','POST',{'status':'approved','version':2})[0]==403,'author cannot approve their own clinical content after role change')
        check(admin.req('/staff/content/'+content['id']+'/transition','POST',{'status':'approved','version':2})[0]==200,'independent administrator can review hospital content')
        for _ in range(5):b.login('b@example.test','Incorrect-password1!')
        check(b.login('b@example.test',password)[0]==401,'five failed passwords trigger lockout')
        check(a.req('/auth/password','POST',{'currentPassword':password,'newPassword':password+'Next'})[0]==204,'password changes invalidate session')
        check(a.req('/chat/conversations')[0]==401,'old cookie cannot access private chat')
        check(a.login('a@example.test',password+'Next')[0]==200,'new password signs in')
        check(a.req('/account','DELETE')[0]==204,'account deletion succeeds')
        check(a.login('a@example.test',password+'Next')[0]==401,'deleted identity cannot sign in')
        count=subprocess.check_output(['docker','exec',name,'psql','-U','wanees','-tAc','SELECT count(*) FROM "Records" WHERE "Kind" IN (\'profiles\',\'conversations\')']).decode().strip()
        check(count=='0','account deletion removes profile and conversation rows')
    (ROOT/'docs/ACCOUNT-CHAT-VERIFICATION.json').write_text(json.dumps({'passed':passed,'database':'PostgreSQL 18','chatProvider':'deterministic test fixture; not a model quality claim'},indent=2)+'\n')
finally:
    if api:api.terminate();api.wait(timeout=15)
    model.shutdown()
    subprocess.run(['docker','rm','-f','-v',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    # Logs deliberately stay outside the deliverable for diagnosis; no credentials printed.
    print('Test log:',work/'api.log')
