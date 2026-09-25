"""Run from the server after starting voice workers; exercises real synthesis."""
import urllib.request, json, wave, io, sys
url = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8000'
language = sys.argv[2] if len(sys.argv)>2 else 'en'
text = 'Hello. We can take our time and imagine a happy story together.' if language=='en' else 'مرحبًا. يمكننا أن نأخذ وقتنا ونتخيّل قصة جميلة معًا.'
for character in ['Wanees','Amer','Maryam']:
 body=json.dumps({'text':text,'character':character,'language':language}).encode()
 with urllib.request.urlopen(urllib.request.Request(url+'/speak',body,{'Content-Type':'application/json'}),timeout=600) as response:audio=response.read()
 with wave.open(io.BytesIO(audio)) as clip:
  assert clip.getnframes()>0
  print(character,language,clip.getframerate(),round(clip.getnframes()/clip.getframerate(),2),'seconds')
