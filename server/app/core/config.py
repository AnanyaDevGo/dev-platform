from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+psycopg://devportal:password@localhost:5432/dev_portal"
    redis_url: str = "redis://localhost:6379"
    jwt_secret: str = "change-me-for-prod"
    session_secret: str = "change-me-for-prod"
    cors_origin: str = "http://localhost:5173"
    port: int = 4000


@lru_cache
def get_settings() -> Settings:
    return Settings()
