from dataclasses import dataclass
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


@dataclass(frozen=True)
class Settings:
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
    chat_model: str = os.getenv("OLLAMA_CHAT_MODEL", "qwen3:4b-instruct")
    embedding_model: str = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
    frontend_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    )
    rate_limit_per_minute: int = int(os.getenv("CHAT_RATE_LIMIT_PER_MINUTE", "12"))
    portfolio_min_relevance_score: float = float(
        os.getenv("PORTFOLIO_MIN_RELEVANCE_SCORE", "0.35")
    )
    knowledge_path: str = os.getenv("PORTFOLIO_KNOWLEDGE_PATH", "content/portfolio.md")


settings = Settings()
