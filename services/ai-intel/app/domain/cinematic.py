from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class CinematicFocusWaypointSchema(BaseModel):
    id: str = Field(description="Identificador único do waypoint (ex: wp_textura_sisal)")
    x_percent: float = Field(description="Posição horizontal do centro focal (0.0 a 100.0)", ge=0.0, le=100.0)
    y_percent: float = Field(description="Posição vertical do centro focal (0.0 a 100.0)", ge=0.0, le=100.0)
    zoom_scale: float = Field(description="Nível de ampliação óptica (1.0 a 4.0)", ge=1.0, le=4.0)
    lighting_mood: Literal['gallery_spot', 'raking_light', 'museum_ambient', 'dramatic_contrast'] = Field(
        default='gallery_spot',
        description="Ambiente de iluminação virtual sobre a tela"
    )
    label: str = Field(description="Rótulo curto da área focal (ex: Relevo em Sisal)")
    description: str = Field(description="Descrição detalhada do detalhe construtivo ou material")

class CinematicNarrativeActSchema(BaseModel):
    act_number: int = Field(description="Número do ato narrativo (1 a 8)", ge=1, le=8)
    title: str = Field(description="Título poético da cena editorial")
    subtitle: Optional[str] = Field(default=None, description="Subtítulo ou contexto da cena")
    prose: str = Field(description="Texto editorial em prosa poética e factual")
    quote_text: Optional[str] = Field(default=None, description="Citação do artesão ou manifesto")
    quote_author: Optional[str] = Field(default=None, description="Autor da citação")
    waypoint_id: Optional[str] = Field(default=None, description="ID do waypoint associado a este ato")
    bg_theme: Literal['dark', 'charcoal', 'sand', 'warm_stone'] = Field(
        default='dark',
        description="Tom de cor de fundo da cena"
    )

class CinematicPaletteSchema(BaseModel):
    primary: str = Field(description="Cor primária extraída da obra (hex)", default="#1A1816")
    background_dark: str = Field(description="Fundo escuro da galeria (hex)", default="#141210")
    background_light: str = Field(description="Fundo claro orgânico (hex)", default="#FAF8F5")
    accent: str = Field(description="Cor de destaque orgânico (hex)", default="#C26D4D")

class CinematicArtworkStorySchema(BaseModel):
    product_id: str
    product_handle: str
    artwork_asset_url: str
    aspect_ratio: float = Field(default=0.75, description="Proporção largura / altura da tela original")
    palette: CinematicPaletteSchema
    waypoints: List[CinematicFocusWaypointSchema]
    acts: List[CinematicNarrativeActSchema]
    curator_note: Optional[str] = None
