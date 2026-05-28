# file: backend/app/core/config.py
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Procurement & Vendor Coordination"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Security & Tokens
    SECRET_KEY: str = "dev-only-change-me-before-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
    
    # Supabase / PostgreSQL Connection
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/procurement_ai"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Meta WhatsApp Cloud API Configurations
    META_APP_SECRET: str = "meta_app_secret_placeholder"
    META_WHATSAPP_TOKEN: str = "meta_token_placeholder"
    META_PHONE_NUMBER_ID: str = "phone_id_placeholder"
    META_VERIFY_TOKEN: str = "webhook_verification_token" # Token you set in Meta App dashboard
    
    # LLM Settings
    OPENAI_API_KEY: Optional[str] = None

    # Razorpay (billing)
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    # Invite system
    INVITE_TOKEN_EXPIRE_HOURS: int = 48
    INVITE_SECRET: str = "invite-secret-change-in-production"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def require_meta_signatures(self) -> bool:
        return self.ENVIRONMENT.lower() not in {"development", "test"}

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.ENVIRONMENT.lower() == "production":
            missing = []
            placeholder_values = {
                "SECRET_KEY": "dev-only-change-me-before-production",
                "META_APP_SECRET": "meta_app_secret_placeholder",
                "META_WHATSAPP_TOKEN": "meta_token_placeholder",
                "META_PHONE_NUMBER_ID": "phone_id_placeholder",
                "META_VERIFY_TOKEN": "webhook_verification_token",
            }
            for field, placeholder in placeholder_values.items():
                value = getattr(self, field)
                if not value or value == placeholder:
                    missing.append(field)
            if self.DATABASE_URL.startswith("sqlite"):
                missing.append("DATABASE_URL(postgres required)")
            if "*" in self.cors_origins:
                missing.append("CORS_ORIGINS(no wildcard in production)")
            if missing:
                raise RuntimeError(f"Production configuration missing or unsafe: {', '.join(missing)}")
        return self
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
