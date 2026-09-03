from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ProductDimensions(BaseModel):
    width_mm: int = Field(default=0, description="Largura em milímetros")
    height_mm: int = Field(default=0, description="Altura em milímetros")
    depth_mm: int = Field(default=0, description="Profundidade em milímetros")

class ProductSnapshot(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    handle: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    categories: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Extrai fatos consolidados
    @property
    def declared_materials(self) -> List[str]:
        return self.metadata.get('design', {}).get('materials', [])
    
    @property
    def declared_styles(self) -> List[str]:
        return self.metadata.get('design', {}).get('styles', [])

    @property
    def dimensions(self) -> ProductDimensions:
        dim = self.metadata.get('dimensions', {})
        return ProductDimensions(
            width_mm=dim.get('width_mm', 0),
            height_mm=dim.get('height_mm', 0),
            depth_mm=dim.get('depth_mm', 0)
        )
