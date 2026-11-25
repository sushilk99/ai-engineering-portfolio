from dataclasses import dataclass
import math
import re
from pathlib import Path
import threading

from app.config import settings
from app.services.ollama import OllamaClient


@dataclass
class Chunk:
    title: str
    anchor: str
    text: str
    embedding: list[float]


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "about"


def _anchor(title: str) -> str:
    known = {
        "about": "top",
        "projects": "work",
        "experience": "experience",
        "experience — schneider electric": "experience-schneider-electric",
        "experience — hcltech": "experience-hcltech",
        "ai skin specialist": "project-ai-skin-specialist",
        "e-commerce app": "project-e-commerce-app",
        "resume scorer": "project-resume-scorer",
        "rag knowledge assistant": "project-rag-knowledge-assistant",
        "skills": "skills",
        "education": "education",
        "certification": "certification",
        "contact": "contact",
    }
    return known.get(title.lower(), _slug(title))


def _read_sections(path: Path) -> list[tuple[str, str]]:
    if not path.exists():
        return []
    sections: list[tuple[str, list[str]]] = []
    current_title = "About"
    current_lines: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            if current_lines:
                sections.append((current_title, current_lines))
            current_title = line[2:].strip()
            current_lines = []
        else:
            current_lines.append(line)
    if current_lines:
        sections.append((current_title, current_lines))

    result: list[tuple[str, str]] = []
    for title, lines in sections:
        text = " ".join(line.strip() for line in lines if line.strip())
        text = re.sub(r"<!--.*?-->", "", text).strip()
        if text:
            result.append((title, text))
    return result


def _chunks(path: Path, max_chars: int = 1100) -> list[tuple[str, str, str]]:
    results: list[tuple[str, str, str]] = []
    for title, text in _read_sections(path):
        paragraphs = re.split(r"(?<=[.!?])\s+", text)
        current = ""
        part = 1
        for sentence in paragraphs:
            sentence = sentence.strip()
            if not sentence:
                continue
            if current and len(current) + len(sentence) + 1 > max_chars:
                anchor = _anchor(title) if part == 1 else f"{_anchor(title)}-{part}"
                results.append((title, anchor, current))
                current = ""
                part += 1
            current = f"{current} {sentence}".strip()
        if current:
            anchor = _anchor(title) if part == 1 else f"{_anchor(title)}-{part}"
            results.append((title, anchor, current))
    return results


def _cosine(left: list[float], right: list[float]) -> float:
    dot = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(a * a for a in left))
    right_norm = math.sqrt(sum(b * b for b in right))
    if not left_norm or not right_norm:
        return 0.0
    return dot / (left_norm * right_norm)


class KnowledgeBase:
    def __init__(self, client: OllamaClient) -> None:
        self.client = client
        self.path = (Path(__file__).resolve().parents[2] / settings.knowledge_path).resolve()
        self._chunks: list[Chunk] = []
        self._indexed_mtime: float | None = None
        self._lock = threading.Lock()

    async def _ensure_index(self) -> None:
        mtime = self.path.stat().st_mtime if self.path.exists() else None
        if self._indexed_mtime == mtime:
            return
        with self._lock:
            if self._indexed_mtime == mtime:
                return
            source_chunks = _chunks(self.path)
        if not source_chunks:
            self._chunks = []
            self._indexed_mtime = mtime
            return
        embeddings = await self.client.embed([item[2] for item in source_chunks])
        if len(embeddings) != len(source_chunks):
            raise RuntimeError("Ollama returned an unexpected number of embeddings.")
        self._chunks = [
            Chunk(title=title, anchor=anchor, text=text, embedding=embedding)
            for (title, anchor, text), embedding in zip(source_chunks, embeddings)
        ]
        self._indexed_mtime = mtime

    async def search(self, query: str, limit: int = 4) -> list[tuple[float, Chunk]]:
        await self._ensure_index()
        if not self._chunks:
            return []
        query_embedding = (await self.client.embed([query]))[0]
        ranked = sorted(
            ((_cosine(query_embedding, chunk.embedding), chunk) for chunk in self._chunks),
            key=lambda item: item[0],
            reverse=True,
        )
        relevant = [
            item for item in ranked
            if item[0] >= settings.portfolio_min_relevance_score
        ]
        return relevant[:limit]
