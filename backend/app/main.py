from collections import defaultdict, deque
from contextlib import asynccontextmanager
import json
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import settings
from app.schemas import ChatRequest, HealthResponse
from app.services.chat import SCOPE_REFUSAL, make_messages
from app.services.knowledge import KnowledgeBase
from app.services.ollama import OllamaClient, OllamaUnavailable


class InMemoryRateLimiter:
    """Simple per-process limit for a low-traffic personal portfolio."""

    def __init__(self, limit: int, window_seconds: int = 60) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self.requests: dict[str, deque[float]] = defaultdict(deque)

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        timestamps = self.requests[key]
        while timestamps and now - timestamps[0] >= self.window_seconds:
            timestamps.popleft()
        if len(timestamps) >= self.limit:
            return False
        timestamps.append(now)
        return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    ollama = OllamaClient()
    app.state.ollama = ollama
    app.state.knowledge = KnowledgeBase(ollama)
    app.state.rate_limiter = InMemoryRateLimiter(settings.rate_limit_per_minute)
    yield


app = FastAPI(
    title="Personal Portfolio API",
    description="Local-first portfolio assistant API backed by Ollama.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.frontend_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def sse(event_name: str, data: dict) -> str:
    return f"event: {event_name}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.get("/api/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    reachable = await request.app.state.ollama.is_reachable()
    return HealthResponse(
        status="ok",
        ollama_reachable=reachable,
        configured_chat_model=settings.chat_model,
        configured_embedding_model=settings.embedding_model,
    )


@app.post("/api/chat/stream")
async def chat_stream(payload: ChatRequest, request: Request) -> StreamingResponse:
    client_ip = request.client.host if request.client else "unknown"
    if not request.app.state.rate_limiter.allow(client_ip):
        raise HTTPException(status_code=429, detail="Please wait a little before asking another question.")

    try:
        recent_context = " ".join(turn.content for turn in payload.history[-2:])
        retrieval_query = f"{recent_context} {payload.message}".strip()
        ranked_sources = await request.app.state.knowledge.search(retrieval_query)
    except OllamaUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    if not ranked_sources:
        async def no_content():
            message = SCOPE_REFUSAL
            yield sse("sources", {"sources": []})
            yield sse("token", {"text": message})
            yield sse("done", {})

        return StreamingResponse(no_content(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

    public_sources = [
        {
            "title": chunk.title,
            "url": f"/#{chunk.anchor}",
            "excerpt": chunk.text[:220] + ("…" if len(chunk.text) > 220 else ""),
        }
        for _, chunk in ranked_sources
    ]
    messages = make_messages(payload.history, payload.message, ranked_sources)

    async def generate():
        yield sse("sources", {"sources": public_sources})
        try:
            async for token in request.app.state.ollama.stream_chat(messages):
                yield sse("token", {"text": token})
            yield sse("done", {})
        except OllamaUnavailable as exc:
            yield sse("error", {"message": str(exc)})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
