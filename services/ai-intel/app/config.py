from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    environment: str = Field(default='development', validation_alias='NODE_ENV')
    valkey_url: str = Field(default='redis://valkey:6379', validation_alias='REDIS_URL')
    
    # LLM Provider
    gemini_api_key: str = Field(default='', validation_alias='GEMINI_API_KEY')
    default_llm_model: str = Field(default='gemini-1.5-flash', validation_alias='AI_MODEL_NAME')
    
    # Medusa Commerce API
    medusa_api_url: str = Field(default='http://medusa:9000', validation_alias='MEDUSA_API_URL')
    medusa_api_token: str = Field(default='', validation_alias='MEDUSA_ADMIN_API_TOKEN')

    # Payload CMS API
    payload_api_url: str = Field(default='http://payload:3001', validation_alias='PAYLOAD_API_URL')
    payload_api_key: str = Field(default='', validation_alias='PAYLOAD_API_KEY')

    # Queue Names
    queue_main: str = 'neruma:ai:queue'
    queue_processing: str = 'neruma:ai:processing'
    queue_retry: str = 'neruma:ai:retry'
    queue_dead: str = 'neruma:ai:dead'

settings = Settings()
