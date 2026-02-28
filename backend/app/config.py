from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/universal_translator"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "changeme"
    LIBRETRANSLATE_URL: str = "http://localhost:5000"
    DATA_DIR: str = "./data"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure data directory exists
os.makedirs(settings.DATA_DIR, exist_ok=True)

SUPPORTED_LANGUAGES = {
    "en": "English",
    "ar": "Arabic",
    "zh": "Chinese (Simplified)",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "ms": "Malay",
    "nl": "Dutch",
    "pl": "Polish",
    "pt": "Portuguese",
    "ru": "Russian",
    "es": "Spanish",
    "sv": "Swedish",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
}
