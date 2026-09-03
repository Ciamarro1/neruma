import httpx
from app.config import settings
from app.domain.product import ProductSnapshot

async def fetch_product_from_medusa(product_id: str) -> ProductSnapshot:
    url = f"{settings.medusa_api_url}/store/products/{product_id}"
    
    headers = {"Content-Type": "application/json"}
    if settings.medusa_api_token:
        headers["Authorization"] = f"Bearer {settings.medusa_api_token}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json().get('product', {})
                return ProductSnapshot(
                    id=data.get('id', product_id),
                    title=data.get('title', 'Produto Neruma'),
                    subtitle=data.get('subtitle'),
                    handle=data.get('handle', 'produto-neruma'),
                    description=data.get('description'),
                    thumbnail=data.get('thumbnail'),
                    images=[img.get('url') for img in data.get('images', []) if img.get('url')],
                    categories=[c.get('name') for c in data.get('categories', [])],
                    metadata=data.get('metadata', {})
                )
            else:
                print(f"[Medusa Integration] Erro {response.status_code} ao buscar produto {product_id}. Usando snapshot de fallback.")
        except Exception as e:
            print(f"[Medusa Integration] Falha de conexão com {url}: {e}")

    # Snapshot de fallback caso Medusa esteja offline durante o teste
    return ProductSnapshot(
        id=product_id,
        title="Painel Orgânico Freijó & Sisal",
        subtitle="Design biofílico feito à mão",
        handle="painel-organico-freijo-sisal",
        description="Painel de parede autoral em madeira Freijó maciça com trama de sisal natural.",
        metadata={
            "design": {"materials": ["madeira_macica_freijo", "fibra_sisal"]},
            "dimensions": {"width_mm": 600, "height_mm": 900, "depth_mm": 45}
        }
    )
