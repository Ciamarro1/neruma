from typing import Protocol, Type, TypeVar
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

class LLMProvider(Protocol):
    async def generate_structured(
        self,
        system_instruction: str,
        user_prompt: str,
        response_model: Type[T]
    ) -> T:
        """Gera resposta estritamente validada no formato Pydantic fornecido"""
        ...
