# Personal AI Engineering Portfolio

Local-first portfolio site built with Next.js (React + TypeScript), a FastAPI chat API, and Ollama for local inference.

## Project layout

- `frontend/` — responsive portfolio and assistant UI.
- `backend/` — FastAPI service, local Ollama client, and portfolio knowledge retrieval.

## Run locally

### 1. Start Ollama

Install Ollama, then pull a small chat model and an embedding model:

```powershell
ollama pull qwen3:4b-instruct
ollama pull nomic-embed-text
```

Ollama should be reachable at `http://localhost:11434`.

### 2. Start the FastAPI backend

```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

The API health endpoint is `http://localhost:8000/api/health`.

### 3. Start the website

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

The portfolio can render without Ollama. The assistant will show a friendly offline message until Ollama and both models are available.

## Portfolio content

The portfolio content is filled from the supplied résumé and project details. The RAG Knowledge Assistant is marked as planned and not yet built. The chatbot shows an availability notice when opened because its AI service and compute resources may be slow or unavailable.

The assistant is restricted to portfolio questions. The API filters out retrieved passages below a semantic relevance threshold, returns a fixed refusal when it has no relevant portfolio material, and instructs the model not to answer general knowledge or unrelated requests. This layered guardrail reduces off-topic replies, but a local language model can still make mistakes. The starting threshold is `0.35`; adjust `PORTFOLIO_MIN_RELEVANCE_SCORE` in `backend/.env` after trying representative questions. A higher value is stricter and may reject valid questions; a lower value accepts more questions but may allow weaker matches.

Update presentation content in `frontend/src/data/site.ts` and assistant reference material in `backend/content/portfolio.md` together when making future edits. The phone number is intentionally omitted; contact links show the provided email, LinkedIn, and GitHub.

For public deployment, host FastAPI and Ollama on an always-on machine or use a hosted model provider. A deployed website cannot reach Ollama on a developer's private computer. Keep Ollama behind FastAPI; do not expose port `11434` to the public internet.

No unprovided employers, outcomes, deployment links, or performance metrics have been added.
