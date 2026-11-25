export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatSource = {
  title: string;
  url: string;
  excerpt: string;
};

export type StreamEvent =
  | { type: "sources"; sources: ChatSource[] }
  | { type: "token"; text: string }
  | { type: "error"; message: string }
  | { type: "done" };

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export async function streamChat(
  message: string,
  history: ChatTurn[],
  onEvent: (event: StreamEvent) => void,
  signal: AbortSignal,
) {
  const response = await fetch(`${API_URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ message, history: history.slice(-6) }),
    signal,
  });

  if (!response.ok) {
    let detail = "The assistant could not answer right now.";
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      // Keep the friendly fallback when the API does not return JSON.
    }
    throw new Error(detail);
  }

  if (!response.body) throw new Error("Streaming is not available in this browser.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const eventName = frame.split("\n").find((line) => line.startsWith("event: "))?.slice(7);
      const dataLine = frame.split("\n").find((line) => line.startsWith("data: "))?.slice(6);
      if (!eventName || !dataLine) continue;
      const data = JSON.parse(dataLine) as Record<string, unknown>;
      if (eventName === "sources") onEvent({ type: "sources", sources: data.sources as ChatSource[] });
      if (eventName === "token") onEvent({ type: "token", text: String(data.text ?? "") });
      if (eventName === "error") onEvent({ type: "error", message: String(data.message ?? "Assistant unavailable.") });
      if (eventName === "done") onEvent({ type: "done" });
    }

    if (done) break;
  }
}
