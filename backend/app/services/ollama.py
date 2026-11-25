import json
from collections.abc import AsyncIterator

import httpx

from app.config import settings


class OllamaUnavailable(RuntimeError):
    """Raised when the local Ollama service cannot fulfill a request."""


class OllamaClient:
    def __init__(self) -> None:
        self.base_url = settings.ollama_base_url

    async def is_reachable(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=2.5) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.is_success
        except httpx.HTTPError:
            return False

    async def embed(self, texts: list[str]) -> list[list[float]]:
        try:
            async with httpx.AsyncClient(timeout=90) as client:
                response = await client.post(
                    f"{self.base_url}/api/embed",
                    json={"model": settings.embedding_model, "input": texts},
                )
                response.raise_for_status()
                payload = response.json()
                return payload["embeddings"]
        except (httpx.HTTPError, KeyError, ValueError) as exc:
            raise OllamaUnavailable(
                "Ollama could not create embeddings. Check that Ollama is running and the embedding model is installed."
            ) from exc

    async def stream_chat(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(180, connect=5)) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json={
                        "model": settings.chat_model,
                        "messages": messages,
                        "stream": True,
                        "options": {"temperature": 0.2, "num_ctx": 4096},
                    },
                ) as response:
                    if response.is_error:
                        detail = (await response.aread()).decode("utf-8", errors="replace")
                        raise OllamaUnavailable(
                            "Ollama could not answer. Check that the configured chat model is installed. "
                            + detail[:300]
                        )
                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        try:
                            chunk = json.loads(line)
                        except json.JSONDecodeError:
                            continue
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            yield content
                        if chunk.get("error"):
                            raise OllamaUnavailable(str(chunk["error"]))
        except httpx.HTTPError as exc:
            raise OllamaUnavailable(
                "Could not connect to Ollama. Start Ollama and try again."
            ) from exc
