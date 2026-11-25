from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)
    history: list[ChatTurn] = Field(default_factory=list, max_length=8)


class HealthResponse(BaseModel):
    status: str
    ollama_reachable: bool
    configured_chat_model: str
    configured_embedding_model: str
