#!/usr/bin/env python3
"""Optional CPU preview, using only local Docker services and open-source models."""
import os, pathlib, subprocess, sys, json, urllib.request, time
root=pathlib.Path(__file__).resolve().parents[1]
def run(args, **kw):return subprocess.run(args,check=True,**kw)
def exists(kind,name):return subprocess.run(['docker',kind,'inspect',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0
try:
 run(['docker','info','--format','{{.ServerVersion}}'],stdout=subprocess.DEVNULL)
 if not exists('image','ollama/ollama:0.34.3'):run(['docker','pull','ollama/ollama:0.34.3'])
 if not exists('image','wanees-voice:kokoro'):run(['docker','build','-f',str(root/'services/voice/Dockerfile'),'-t','wanees-voice:kokoro',str(root)])
 for name,image,port,volume in [('wanees-chat-local','ollama/ollama:0.34.3','127.0.0.1:11436:11434','wanees-ai-models:/root/.ollama'),('wanees-voice-local','wanees-voice:kokoro','127.0.0.1:8005:8000','wanees-english-models:/models')]:
  if exists('container',name):run(['docker','start',name],stdout=subprocess.DEVNULL)
  else:run(['docker','run','-d','--name',name,'-p',port,'-v',volume,image])
 for _ in range(60):
  try:
   with urllib.request.urlopen('http://127.0.0.1:11436/api/tags',timeout=3) as response:models=json.load(response)['models']
   break
  except OSError:time.sleep(1)
 else:raise RuntimeError('Ollama did not start. Check Docker Desktop.')
 if not any(m['name']=='qwen3:0.6b' for m in models):run(['docker','exec','wanees-chat-local','ollama','pull','qwen3:0.6b'])
 os.environ.update(AI__ChatUrl='http://127.0.0.1:11436',AI__Model='qwen3:0.6b',AI__VoiceUrl='http://127.0.0.1:8005')
 print('Local CPU preview uses Qwen3 0.6B and Kokoro English speech. Your hosted model can be larger.',flush=True)
 os.execv(sys.executable,[sys.executable,str(root/'scripts/serve.py')])
except (OSError,subprocess.CalledProcessError,RuntimeError) as error:raise SystemExit('Could not start local AI services: '+str(error))
