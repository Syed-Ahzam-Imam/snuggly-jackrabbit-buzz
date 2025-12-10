from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Snuggly Jackrabbit Buzz"
    MONGODB_URL: str
    DATABASE_NAME: str = "snuggly_jackrabbit_buzz"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5137"]
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()