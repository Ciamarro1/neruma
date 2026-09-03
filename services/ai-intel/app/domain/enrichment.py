from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal

class DesignAttributes(BaseModel):
    materials: List[str] = Field(description="Lista de materiais reais identificados (ex: freijo, sisal)")
    styles: List[str] = Field(description="Estilos de design (ex: japandi, organico, wabi_sabi)")
    rooms: List[str] = Field(description="Ambientes ideais (ex: sala_de_estar, quarto, espaco_pet)")
    finishes: List[str] = Field(description="Acabamentos de superfície (ex: oleo_mineral, verniz_fosco)")

class SEOPackage(BaseModel):
    meta_title: str = Field(description="Título SEO otimizado (50 a 65 caracteres)")
    meta_description: str = Field(description="Meta description atraente e biofílica (130 a 160 caracteres)")
    focus_keywords: List[str] = Field(description="Palavras-chave principais")
    suggested_slug: str = Field(description="Slug amigável e limpo")

class ProductEnrichment(BaseModel):
    title_commercial: str = Field(description="Título comercial elegante e autoral")
    subtitle: str = Field(description="Subtítulo poético e conceitual")
    description_commercial: str = Field(description="Descrição comercial focada em aconchego, acabamento e sustentabilidade")
    storytelling: str = Field(description="História da concepção da peça e harmonia com a natureza")
    design: DesignAttributes
    seo: SEOPackage
    alt_texts: Dict[str, str] = Field(default_factory=dict, description="Mapeamento de URL da imagem para alt-text detalhado")
    confidence: float = Field(default=0.95, description="Índice de confiança da geração (0.0 a 1.0)")

class QualityGateResult(BaseModel):
    passed: bool = Field(default=True)
    confidence_score: float
    routing: Literal['auto_publish', 'human_review', 'rejected']
    failed_rules: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
