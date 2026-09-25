FROM python:3.11-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends espeak-ng libsndfile1 libgomp1 && rm -rf /var/lib/apt/lists/*
WORKDIR /service
COPY services/voice/requirements.txt .
RUN pip install --no-cache-dir torch==2.6.0 --index-url https://download.pytorch.org/whl/cpu && pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl
COPY services/voice/app.py .
ENV HF_HOME=/models HF_HUB_DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 TOKENIZERS_PARALLELISM=false OMP_NUM_THREADS=2
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--no-access-log"]
