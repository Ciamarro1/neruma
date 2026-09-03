# ==============================================================================
# NERUMA AI PRODUCT INTELLIGENCE LAYER (API & ASYNC QUEUE WORKER)
# ==============================================================================

FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1001 nerumaai

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R nerumaai:nerumaai /app

USER nerumaai

EXPOSE 8000

# Default: Inicia o FastAPI HTTP server (pode ser sobrescrito pelo compose para rodar o consumer)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
