"""Private, single-worker speech service. No audio or user text is logged/stored."""
import io, os, pathlib, threading
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
import numpy as np
import soundfile as sf

app = FastAPI(docs_url=None, redoc_url=None)
lock = threading.Lock()
engine = os.environ.get('VOICE_ENGINE', 'kokoro')
model = None
pipelines = {}
# Curated synthetic stock voices, not recordings or clones of a named real person.
voices = {'Wanees': ('bm_george', .94), 'Amer': ('am_fenrir', .97), 'Maryam': ('af_heart', .96)}
class Speech(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    character: Literal['Wanees', 'Amer', 'Maryam']
    language: Literal['en', 'ar']

def synthesize(request):
    global model
    if engine == 'kokoro':
        if request.language != 'en': raise HTTPException(422, 'Kokoro voices support English here. Use the Arabic service.')
        from kokoro import KPipeline
        voice, speed = voices[request.character]
        lang = voice[0]
        if lang not in pipelines: pipelines[lang] = KPipeline(lang_code=lang, device=os.environ.get('DEVICE', 'cpu'))
        chunks = [audio.numpy() for _, _, audio in pipelines[lang](request.text, voice=voice, speed=speed)]
        if not chunks: raise HTTPException(503, 'No speech generated')
        samples, sr = np.concatenate(chunks), 24000
    else:
        if request.language != 'ar': raise HTTPException(422, 'Use the English service for English')
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        reference = pathlib.Path('/references') / (request.character.lower() + '.wav')
        if not reference.exists(): raise HTTPException(503, 'Generate the synthetic character reference pack first')
        if model is None: model = ChatterboxMultilingualTTS.from_pretrained(device=os.environ.get('DEVICE', 'cpu'))
        # Leave the upstream watermark in place. A synthetic stock reference is used.
        wav = model.generate(request.text, language_id='ar', audio_prompt_path=str(reference), exaggeration=.35, cfg_weight=0.0)
        samples, sr = wav.squeeze().cpu().numpy(), model.sr
    if len(samples) / sr > 180: raise HTTPException(422, 'Speech exceeds duration limit')
    out = io.BytesIO(); sf.write(out, samples, sr, format='WAV', subtype='PCM_16'); return out.getvalue()

@app.get('/health')
def health(): return {'status': 'ok', 'engine': engine, 'loaded': bool(pipelines) or model is not None}

@app.post('/speak')
def speak(request: Speech):
    if not lock.acquire(blocking=False): raise HTTPException(429, 'Voice is busy. Retry shortly.')
    try: return Response(synthesize(request), media_type='audio/wav')
    finally: lock.release()

if __name__ == '__main__':
    import sys
    if '--reference-pack' in sys.argv:
        target = pathlib.Path('/references'); target.mkdir(exist_ok=True, parents=True)
        lines = {
          'Wanees': 'Hello, I am your gentle companion. We can take our time together. Let us imagine a little boat floating on a quiet sea. Take a soft breath in, and let it slowly out. What would you like to explore today?',
          'Amer': 'Hello, I am Amer. I like asking questions and finding out how things work. We can explore one small thing at a time, and we can always take a break. Would you like to make up a happy story with me?',
          'Maryam': 'Hello, I am Maryam. I am glad you are here. We can imagine a colourful garden, or practise a calm breath together. There is no hurry at all. What would help you feel a little more comfortable today?'
        }
        for character, text in lines.items():
            (target / (character.lower() + '.wav')).write_bytes(synthesize(Speech(text=text, character=character, language='en')))
            print('Generated synthetic reference:', character, flush=True)
