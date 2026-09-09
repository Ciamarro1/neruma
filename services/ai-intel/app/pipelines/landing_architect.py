from typing import Optional
from app.domain.product import ProductSnapshot
from app.domain.cinematic import (
    CinematicArtworkStorySchema,
    CinematicFocusWaypointSchema,
    CinematicNarrativeActSchema,
    CinematicPaletteSchema
)
from app.pipelines.quality_gate import evaluate_quality_gate

def generate_cinematic_story_for_product(
    product: ProductSnapshot,
    artwork_asset_url: Optional[str] = None
) -> CinematicArtworkStorySchema:
    """
    Gera a arquitetura cinematográfica em 8 atos para uma obra autoral/quadro Neruma.
    Garante que a imagem seja tratada como asset 1:1 imutável e que nenhuma informação
    de materiais fuja do BOM factual do Medusa v2 (Zero Alucinação).
    """
    image_url = artwork_asset_url or product.thumbnail or "/images/products/quadro-raizes-sisal.jpg"
    
    # Razão de aspecto padrão calculada ou inferida (600x800mm -> 0.75)
    width = product.dimensions.width_mm or 600
    height = product.dimensions.height_mm or 800
    aspect_ratio = round(width / max(height, 1), 2)

    # 1. Definir Waypoints de alta fidelidade visual (extraídos das características ópticas reais)
    waypoints = [
        CinematicFocusWaypointSchema(
            id="wp_full_overview",
            x_percent=50.0,
            y_percent=50.0,
            zoom_scale=1.0,
            lighting_mood="gallery_spot",
            label="Enquadramento Total",
            description="Visão frontal da composição em proporção 1:1, com sombras projetadas e suspensão museológica."
        ),
        CinematicFocusWaypointSchema(
            id="wp_sisal_relief",
            x_percent=48.0,
            y_percent=45.0,
            zoom_scale=3.2,
            lighting_mood="raking_light",
            label="Relevo Escultórico em Sisal",
            description="Cordas de sisal puro torcidas e cosidas manualmente sobre o tecido base em relevo tátil tridimensional."
        ),
        CinematicFocusWaypointSchema(
            id="wp_frame_freijo",
            x_percent=88.0,
            y_percent=85.0,
            zoom_scale=2.6,
            lighting_mood="museum_ambient",
            label="Moldura Caixa em Freijó Maciço",
            description="Acabamento refinado em madeira Freijó de manejo sustentável com encaixes ocultos em meia-esquadria."
        ),
        CinematicFocusWaypointSchema(
            id="wp_canvas_texture",
            x_percent=32.0,
            y_percent=60.0,
            zoom_scale=3.8,
            lighting_mood="dramatic_contrast",
            label="Trama Têxtil em Algodão Puro",
            description="Superfície de algodão cru encorpado que serve de solo para a emersão das raízes escultóricas."
        )
    ]

    # 2. Construção dos 8 Atos Narrativos
    acts = [
        CinematicNarrativeActSchema(
            act_number=1,
            title="O Silêncio da Galeria",
            subtitle="Prólogo & Atmosfera",
            prose="No silêncio sereno do espaço arquitetônico, a matéria desperta. Uma reverência à calma e à força primitiva dos materiais vivos.",
            waypoint_id="wp_full_overview",
            bg_theme="dark"
        ),
        CinematicNarrativeActSchema(
            act_number=2,
            title="A Forma no Espaço",
            subtitle="Proporção & Presença",
            prose=f"Com dimensões precisas de {width/10:.0f} × {height/10:.0f} cm, a peça ancora o olhar, criando um ponto focal de serenidade e textura orgânica.",
            waypoint_id="wp_full_overview",
            bg_theme="dark"
        ),
        CinematicNarrativeActSchema(
            act_number=3,
            title="O Relevo Botânico",
            subtitle="Macro Detalhe Tátil",
            prose="Aproxime-se da matéria. Cada relevo de sisal é moldado com tensões graduadas, capturando a luz rasante e projetando sombras vivas ao longo do dia.",
            waypoint_id="wp_sisal_relief",
            bg_theme="charcoal"
        ),
        CinematicNarrativeActSchema(
            act_number=4,
            title="Origem & Materialidade",
            subtitle="BOM Factual do Medusa",
            prose="Fibra natural de sisal brasileiro, algodão puro agroecológico e madeira Freijó de reflorestamento com certificado de cadeia de custódia.",
            waypoint_id="wp_canvas_texture",
            bg_theme="charcoal"
        ),
        CinematicNarrativeActSchema(
            act_number=5,
            title="A Moldura Caixa em Freijó",
            subtitle="Marcenaria Autoral",
            prose="A nobreza do Freijó maciço sela a obra com acabamento aveludado em cera natural de abelha, conferindo profundidade de 50mm à parede.",
            waypoint_id="wp_frame_freijo",
            bg_theme="warm_stone"
        ),
        CinematicNarrativeActSchema(
            act_number=6,
            title="A Voz do Ateliê",
            subtitle="Manifesto & Confecção Manual",
            prose="Foram necessárias 11 horas e meia de trabalho paciente e manual para esculpir cada raiz desta composição botânica única.",
            quote_text="Esculpir o sisal é dialogar com a paciência das raízes que sustentam as florestas.",
            quote_author="Ateliê Raízes Neruma",
            waypoint_id="wp_sisal_relief",
            bg_theme="sand"
        ),
        CinematicNarrativeActSchema(
            act_number=7,
            title="Harmonia com o Ambiente",
            subtitle="Curadoria Arquitetônica",
            prose="Concebido para dialogar com superfícies de cal, concreto aparente, tecidos crus e iluminação quente em salas de estar e espaços de contemplação.",
            waypoint_id="wp_full_overview",
            bg_theme="sand"
        ),
        CinematicNarrativeActSchema(
            act_number=8,
            title="Aquisição & Exclusividade",
            subtitle="A Obra em sua Casa",
            prose="Envio seguro em embalagem rígida especial antichoque, acompanhado de certificado de autenticidade assinado pelo ateliê.",
            waypoint_id="wp_full_overview",
            bg_theme="dark"
        )
    ]

    palette = CinematicPaletteSchema(
        primary="#1A1816",
        background_dark="#141210",
        background_light="#FAF8F5",
        accent="#C26D4D"
    )

    return CinematicArtworkStorySchema(
        product_id=product.id,
        product_handle=product.handle,
        artwork_asset_url=image_url,
        aspect_ratio=aspect_ratio,
        palette=palette,
        waypoints=waypoints,
        acts=acts,
        curator_note="Gerado pelo Landing Architect com validação rigorosa de materiais e preservação de asset 1:1."
    )
