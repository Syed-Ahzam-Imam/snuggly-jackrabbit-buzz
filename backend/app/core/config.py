from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Snuggly Jackrabbit Buzz"
    MONGODB_URL: str
    DATABASE_NAME: str = "snuggly_jackrabbit_buzz"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5137", "https://snuggly-jackrabbit-buzz.onrender.com"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    SECRET_KEY: str
    GEMINI_API_KEY: str
    OPENROUTER_API_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email settings
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    ALGORITHM: str = "HS256"
    
    # Resend setting
    RESEND_API_KEY: str
    RESEND_FROM_EMAIL: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()