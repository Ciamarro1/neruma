import pytest
from app.domain.product import ProductSnapshot, ProductDimensions
from app.pipelines.landing_architect import generate_cinematic_story_for_product

def test_landing_architect_generates_8_acts_with_no_hallucination():
    product = ProductSnapshot(
        id="prod_quadro_sisal_01",
        handle="quadro-escultura-raizes-sisal",
        title="Quadro Escultura Raízes em Sisal & Moldura Freijó",
        description="Quadro em relevo de sisal com moldura freijó.",
        declared_materials=["fibra_sisal", "madeira_macica_freijo", "corda_algodao"],
        dimensions=ProductDimensions(width_mm=600, height_mm=800, depth_mm=50),
        categories=["Quadros & Painéis", "Esculturas"],
        thumbnail="/images/products/quadro-raizes-sisal.jpg"
    )

    story = generate_cinematic_story_for_product(product)

    # 1. Deve ter exatamente 8 atos narrativos
    assert len(story.acts) == 8
    assert story.acts[0].act_number == 1
    assert story.acts[-1].act_number == 8

    # 2. Asset deve ser preservado 1:1
    assert story.artwork_asset_url == "/images/products/quadro-raizes-sisal.jpg"

    # 3. Deve possuir waypoints com coordenadas válidas
    assert len(story.waypoints) >= 3
    for wp in story.waypoints:
        assert 0.0 <= wp.x_percent <= 100.0
        assert 0.0 <= wp.y_percent <= 100.0
        assert 1.0 <= wp.zoom_scale <= 4.0

    # 4. Assegurar que os materiais nos waypoints pertencem aos materiais do produto
    assert any("Sisal" in wp.label for wp in story.waypoints)
    assert any("Freijó" in wp.label for wp in story.waypoints)
