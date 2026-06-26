import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { streamChatMessage } from '../api/chat';
import { useAuth } from '../context/AuthContext';
import type { ChatCard, ChatMessage } from '../types';
import { getApiErrorMessage } from '../utils/apiError';
import { ChatRouteCard } from './ChatRouteCard';

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: 'Hi there 👋 I\'m TripGuard Assistant. Ask about routes, delays, or say "flights from Vijayawada to Finland tomorrow".',
};

const SUGGESTED_PROMPTS = [
  'Check delays on my flight',
  'Flights near me today',
  'How do I add a booking?',
  'Vijayawada to Helsinki tomorrow',
] as const;

const HOVER_TOASTS = [
  'Need help with a route?',
  'Track delays in real time',
  'Ask about your trip ✈️',
] as const;

function formatTime() {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-eu-blue/50"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-eu-navy to-eu-blue text-xs font-bold text-white shadow-sm">
      TG
    </div>
  );
}

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-eu-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface DisplayMessage extends ChatMessage {
  cards?: ChatCard[];
  time?: string;
}

export function ChatBot() {
  const { authenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [streamCards, setStreamCards] = useState<ChatCard[]>([]);
  const [hoverToast, setHoverToast] = useState<string | null>(null);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const toastIndex = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText, streaming, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
    }
  }, [open]);

  if (!authenticated) {
    return null;
  }

  function buildHistory() {
    return messages
      .filter((msg) => msg !== WELCOME)
      .filter((msg) => !msg.content.includes('unexpected error') && !msg.content.includes('could not respond'))
      .map(({ role, content }) => ({ role, content }))
      .slice(-10);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) {
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, time: formatTime() }]);
    setInput('');
    setStreaming(true);
    setStreamText('');
    setStreamCards([]);
    let accumulated = '';
    let cards: ChatCard[] = [];

    await streamChatMessage(
      { message: trimmed, history: buildHistory() },
      {
        onToken: (token) => {
          accumulated += token;
          setStreamText(accumulated);
        },
        onCards: (incoming) => {
          cards = incoming;
          setStreamCards(incoming);
        },
        onDone: () => {
          if (accumulated.trim()) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: accumulated,
                cards: cards.length ? cards : undefined,
                time: formatTime(),
              },
            ]);
          }
          setStreamText('');
          setStreamCards([]);
          setStreaming(false);
          if (!open) {
            setUnread((n) => n + 1);
          }
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: getApiErrorMessage(error, 'Sorry, I could not respond right now.'),
              time: formatTime(),
            },
          ]);
          setStreamText('');
          setStreaming(false);
        },
      },
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage(input);
  }

  function cycleToast() {
    const msg = HOVER_TOASTS[toastIndex.current % HOVER_TOASTS.length];
    toastIndex.current += 1;
    setHoverToast(msg);
    window.setTimeout(() => setHoverToast(null), 2800);
  }

  return (
    <>
      {/* Intercom-style hover toast */}
      <AnimatePresence>
        {!open && hoverToast ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-50 max-w-[17rem] rounded-2xl border border-white/60 bg-white/95 p-4 shadow-2xl shadow-eu-navy/15 backdrop-blur-xl"
          >
            <div className="flex gap-3">
              <AssistantAvatar />
              <div>
                <p className="text-sm font-semibold text-eu-navy">TripGuard Assistant</p>
                <p className="mt-1 text-sm text-ink-muted">{hoverToast}</p>
                <p className="mt-2 text-[10px] text-ink-muted/80">TripGuard · Just now</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(36rem,78vh)] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl shadow-eu-navy/20 backdrop-blur-2xl"
          >
            {/* Header — Intercom clean */}
            <div className="flex items-center justify-between border-b border-border/60 bg-white/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <AssistantAvatar />
                <div>
                  <p className="font-semibold text-eu-navy">TripGuard Assistant</p>
                  <p className="text-xs text-ink-muted">AI travel helper · streaming</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-ink-muted transition hover:bg-muted hover:text-eu-navy"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.role}-${index}-${msg.time ?? index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' ? <AssistantAvatar /> : null}
                  <div className={`max-w-[82%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-md bg-eu-navy text-white'
                          : 'rounded-bl-md bg-muted text-gray-800'
                      }`}
                    >
                      {msg.role === 'assistant' ? renderMarkdownLite(msg.content) : msg.content}
                    </div>
                    {msg.cards?.length ? (
                      <div className="space-y-2">
                        {msg.cards.map((card, i) => (
                          <ChatRouteCard key={`${card.title}-${i}`} card={card} index={i} />
                        ))}
                      </div>
                    ) : null}
                    <p className={`text-[10px] text-ink-muted ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.role === 'assistant' ? 'TripGuard' : 'You'} · {msg.time ?? 'Just now'}
                    </p>
                  </div>
                </motion.div>
              ))}

              {streaming && streamText ? (
                <div className="flex gap-2">
                  <AssistantAvatar />
                  <div className="max-w-[82%] space-y-2">
                    <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm leading-relaxed text-gray-800">
                      {renderMarkdownLite(streamText)}
                      <motion.span
                        className="ml-0.5 inline-block h-4 w-0.5 bg-eu-blue"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </div>
                    {streamCards.length > 0 ? (
                      <div className="space-y-2">
                        {streamCards.map((card, i) => (
                          <ChatRouteCard key={`stream-${card.title}-${i}`} card={card} index={i} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {streaming && !streamText ? (
                <div className="flex gap-2">
                  <AssistantAvatar />
                  <div className="rounded-2xl rounded-bl-md bg-muted px-3">
                    <TypingIndicator />
                  </div>
                </div>
              ) : null}

              {!streaming && messages.length <= 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-eu-blue/25 bg-eu-blue/5 px-3 py-1.5 text-xs font-medium text-eu-blue transition hover:border-eu-blue hover:bg-eu-blue/10"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border/60 bg-white/80 p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-white px-3 py-2 shadow-inner focus-within:border-eu-blue focus-within:ring-2 focus-within:ring-eu-blue/15">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm outline-none placeholder:text-ink-muted"
                  disabled={streaming}
                />
                <motion.button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-eu-blue to-eu-navy text-white shadow-md disabled:opacity-40"
                  aria-label="Send"
                >
                  ↑
                </motion.button>
              </div>
              <p className="mt-2 text-center text-[10px] text-ink-muted">Powered by TripGuard AI</p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={cycleToast}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-eu-navy text-xl text-white shadow-xl shadow-eu-navy/40 ring-4 ring-white/80"
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? (
          <span className="text-lg">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
        {!open && unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-eu-red px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </motion.button>
    </>
  );
}
