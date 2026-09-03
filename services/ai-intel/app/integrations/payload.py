import httpx
from app.config import settings
from app.domain.enrichment import ProductEnrichment, QualityGateResult

async def create_or_update_payload_draft(
    product_id: str,
    product_handle: str,
    enrichment: ProductEnrichment,
    quality_gate: QualityGateResult
) -> dict:
    url = f"{settings.payload_api_url}/api/stories"
    
    headers = {"Content-Type": "application/json"}
    if settings.payload_api_key:
        headers["Authorization"] = f"users API-Key {settings.payload_api_key}"

    payload_data = {
        "title": enrichment.title_commercial,
        "slug": f"draft-ai-{product_handle}",
        "excerpt": enrichment.short_description,
        "author": "Neruma AI Curator",
        "readingTimeMinutes": 3,
        "_status": "draft", # Human-in-the-loop: salvo como rascunho para revisão
        "relatedProductHandles": [{"handle": product_handle}],
        "tags": ["artesanato", "biofilico"],
        "metadata": {
            "generated_by": "neruma-ai-worker",
            "confidence_score": quality_gate.confidence_score,
            "routing": quality_gate.routing,
            "seo_package": enrichment.seo.model_dump(),
            "design_attributes": enrichment.design.model_dump(),
            "quality_gate_passed": quality_gate.passed,
            "warnings": quality_gate.warnings
        }
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(url, json=payload_data, headers=headers)
            if response.status_code in (200, 201):
                print(f"[Payload Integration] Rascunho editorial criado para o produto {product_handle} com status DRAFT.")
                return response.json()
            else:
                print(f"[Payload Integration] Erro {response.status_code} ao salvar rascunho no Payload: {response.text}")
        except Exception as e:
            print(f"[Payload Integration] Falha de conexão com {url}: {e}")

    return {"status": "saved_offline", "data": payload_data}
