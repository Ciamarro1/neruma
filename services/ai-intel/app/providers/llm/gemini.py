import google.generativeai as genai
import json
from typing import Type, TypeVar
from pydantic import BaseModel
from app.config import settings
from app.providers.llm.base import LLMProvider

T = TypeVar('T', bound=BaseModel)

class GeminiProvider:
    def __init__(self, api_key: str = None, model_name: str = None):
        self.api_key = api_key or settings.gemini_api_key
        self.model_name = model_name or settings.default_llm_model
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def generate_structured(
        self,
        system_instruction: str,
        user_prompt: str,
        response_model: Type[T]
    ) -> T:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY não configurada no ambiente.")

        model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=system_instruction,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.3, # Baixa temperatura para precisão factual
            }
        )

        response = await model.generate_content_async(user_prompt)
        raw_json = json.loads(response.text)
        
        # Validação estrita via Pydantic
        return response_model.model_validate(raw_json)
