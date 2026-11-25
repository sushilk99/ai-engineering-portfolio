"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { assistantSuggestions } from "@/data/site";
import { streamChat } from "@/lib/chat";
import type { ChatSource, ChatTurn } from "@/lib/chat";

type Message = ChatTurn & { id: string; sources?: ChatSource[] };

const greeting: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi — I can answer questions about Sushil's portfolio, experience, projects, skills, education, and contact details. I don't answer general or unrelated questions, and I'll say when a portfolio detail isn't available.",
  sources: [],
};

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [showLatestButton, setShowLatestButton] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const noticeButtonRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      if (showNotice) noticeButtonRef.current?.focus();
      else inputRef.current?.focus();
    } else if (hasOpenedRef.current) {
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open, showNotice]);

  useEffect(() => {
    const list = messagesRef.current;
    if (!open || !list || !shouldAutoScrollRef.current) return;
    list.scrollTop = list.scrollHeight;
    setShowLatestButton(false);
  }, [messages, open]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && open) {
        abortRef.current?.abort();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function sendQuestion(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || pending) return;
    const history = messages
      .filter((message) => message.id !== "greeting")
      .map(({ role, content }) => ({ role, content }));
    const userId = crypto.randomUUID();
    const answerId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", content: cleanQuestion },
      { id: answerId, role: "assistant", content: "", sources: [] },
    ]);
    shouldAutoScrollRef.current = true;
    setShowLatestButton(false);
    setDraft("");
    setPending(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        cleanQuestion,
        history,
        (event) => {
          if (event.type === "sources") {
            setMessages((current) =>
              current.map((item) =>
                item.id === answerId
                  ? { ...item, sources: event.sources }
                  : item,
              ),
            );
          }
          if (event.type === "token") {
            setMessages((current) =>
              current.map((item) =>
                item.id === answerId
                  ? { ...item, content: item.content + event.text }
                  : item,
              ),
            );
          }
          if (event.type === "error") {
            setMessages((current) =>
              current.map((item) =>
                item.id === answerId
                  ? { ...item, content: event.message }
                  : item,
              ),
            );
          }
        },
        controller.signal,
      );
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setMessages((current) =>
          current.map((item) =>
            item.id === answerId
              ? {
                  ...item,
                  content: `${error.message} Make sure the FastAPI service and Ollama are running.`,
                }
              : item,
          ),
        );
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(draft);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
    }
  }

  function resetChat() {
    abortRef.current?.abort();
    setMessages([greeting]);
    setPending(false);
    setDraft("");
  }

  function openAssistant() {
    setShowNotice(true);
    shouldAutoScrollRef.current = true;
    setOpen(true);
  }

  function scrollToLatest() {
    shouldAutoScrollRef.current = true;
    setShowLatestButton(false);
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <>
      {open && (
        <button
          className="chat-scrim"
          aria-label="Close portfolio assistant"
          onClick={() => setOpen(false)}
        />
      )}
      <section
        className={`assistant-panel${open ? " assistant-panel--open" : ""}`}
        id="portfolio-assistant"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-labelledby="assistant-title"
        aria-hidden={!open}
        inert={!open}
      >
        {open && showNotice && (
          <div className="assistant-notice-backdrop">
            <section
              className="assistant-notice"
              role="alertdialog"
              aria-labelledby="assistant-notice-title"
              aria-describedby="assistant-notice-copy"
            >
              <p className="assistant-notice__eyebrow">A QUICK NOTE</p>
              <h3 id="assistant-notice-title">About availability</h3>
              <p className="assistant-notice__copy" id="assistant-notice-copy">
                The AI assistant may be temporarily unavailable. It relies on a
                separate AI service that may be offline, busy, or limited by its
                hosting plan. If it doesn’t respond, please try again later. You
                can still browse the rest of the portfolio.
              </p>
              <button
                className="assistant-notice__button"
                type="button"
                ref={noticeButtonRef}
                onClick={() => setShowNotice(false)}
              >
                Got it — continue to chat
              </button>
            </section>
          </div>
        )}
        <div className="assistant-header" inert={showNotice}>
          <div className="assistant-avatar" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="assistant-heading">
            <p>PORTFOLIO COPILOT</p>
            <h2 id="assistant-title">Ask about my work</h2>
          </div>
          <button
            className="assistant-icon-button"
            onClick={resetChat}
            aria-label="Start a new chat"
            title="New chat"
          >
            ↺
          </button>
          <button
            className="assistant-icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
          >
            ×
          </button>
        </div>
        <div className="assistant-context" inert={showNotice}>
          <span className="signal-dot" />
          Portfolio questions only · Answers link to their source.
        </div>
        <div
          className="assistant-messages"
          ref={messagesRef}
          inert={showNotice}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          onScroll={(event) => {
            const list = event.currentTarget;
            const atLatest =
              list.scrollHeight - list.scrollTop - list.clientHeight < 72;
            shouldAutoScrollRef.current = atLatest;
            setShowLatestButton(!atLatest);
          }}
        >
          {messages.map((message) => (
            <article
              className={`chat-message chat-message--${message.role}`}
              key={message.id}
            >
              <p className="chat-message__role">
                {message.role === "assistant" ? "ASSISTANT" : "YOU"}
              </p>
              <p className="chat-message__text">
                {message.content ||
                  (pending ? (
                    <span
                      className="typing-dots"
                      aria-label="Assistant is thinking"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    ""
                  ))}
              </p>
              {!!message.sources?.length && (
                <div className="chat-sources">
                  <span>PORTFOLIO SOURCES</span>
                  {message.sources.map((source, index) => (
                    <a key={`${source.url}-${index}`} href={source.url}>
                      {source.title}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
          {messages.length === 1 && (
            <div className="suggestions">
              <p>TRY ASKING</p>
              {assistantSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void sendQuestion(suggestion)}
                  disabled={pending}
                >
                  {suggestion}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {showLatestButton && open && !showNotice && (
          <button
            className="jump-latest"
            type="button"
            onClick={scrollToLatest}
          >
            Latest message <span aria-hidden="true">↓</span>
          </button>
        )}
        <form className="assistant-form" inert={showNotice} onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="assistant-input">
            Ask about the portfolio
          </label>
          <input
            id="assistant-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onInputKeyDown}
            maxLength={1200}
            placeholder="Ask about projects, skills, or experience…"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={!draft.trim() || pending}
            aria-label="Send message"
          >
            <span aria-hidden="true">↑</span>
          </button>
          <p>Grounded answers · No conversation is saved</p>
        </form>
      </section>
      <button
        className={`assistant-launcher${open ? " assistant-launcher--hidden" : ""}`}
        onClick={openAssistant}
        ref={launcherRef}
        aria-expanded={open}
        aria-controls="portfolio-assistant"
      >
        <span className="launcher-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        <span>Ask my AI assistant</span>
        <span className="launcher-arrow" aria-hidden="true">
          ↗
        </span>
      </button>
    </>
  );
}
