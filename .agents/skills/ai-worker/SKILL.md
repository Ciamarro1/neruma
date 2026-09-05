---
name: ai-worker
description: Procedimentos de desenvolvimento do Neruma AI Product Intelligence Layer (services/ai-intel), incluindo consumidor assíncrono Valkey, Quality Gate anti-alucinação e integração com Gemini Structured Outputs.
---

# AI Intelligence & Worker Skill — Neruma

Esta habilidade orienta o desenvolvimento do serviço de inteligência artificial assíncrona (`services/ai-intel`).

## 1. Responsabilidade
- Consumo resiliente de jobs da fila Valkey (`neruma:ai:queue`) usando operações atômicas `BRPOPLPUSH`.
- Orquestração de enriquecimento de produto:
  1. Busca snapshot factual do produto no Medusa via REST.
  2. Executa geração estruturada com o modelo Gemini (ou fallback determinístico) usando prompts factuais.
  3. Validação rigorosa pelo **Quality Gate**: impede alucinações de materiais, checa tamanho de meta tags de SEO e gera pontuação de confiança (*confidence score*).
  4. Gravação de rascunho enriquecido na coleção `stories` do Payload CMS com autor `Neruma AI Curator`.

## 2. Comandos Frequentes
```bash
# Navegar até o serviço
cd services/ai-intel

# Ativar ambiente virtual (exemplo)
python -m venv .venv
.venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Executar suíte de testes do Quality Gate
pytest tests/ -v

# Iniciar o servidor de API
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Iniciar o worker consumidor de fila
python -m app.worker.consumer
```

## 3. Diretrizes Críticas
- **Tolerância Zero a Alucinações:** O Quality Gate (`app/pipelines/quality_gate.py`) deve falhar o job caso o texto gerado mencione qualquer tipo de madeira, fibra ou certificação que não conste expressamente nos metadados ou BOM do Medusa.
- **Idempotência:** Antes de processar um job, valide se a chave no Valkey não foi processada recentemente, evitando cobranças e execuções desnecessárias na API de LLM.
