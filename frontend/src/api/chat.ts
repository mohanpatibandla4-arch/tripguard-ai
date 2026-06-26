import { getToken } from '../utils/token';
import type { ChatCard, ChatRequest, ChatResponse } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/v1';

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const token = getToken();
  const res = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { response: { data: err } };
  }
  return res.json();
}

export interface StreamChatCallbacks {
  onToken: (token: string) => void;
  onCards: (cards: ChatCard[]) => void;
  onDone: () => void;
  onError: (error: unknown) => void;
}

export async function streamChatMessage(
  payload: ChatRequest,
  callbacks: StreamChatCallbacks,
): Promise<void> {
  const token = getToken();
  const res = await fetch(`${baseURL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    callbacks.onError({ response: { data: err } });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const lines = part.split('\n');
        let event = 'message';
        let data = '';
        for (const line of lines) {
          if (line.startsWith('event:')) {
            event = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            data += line.slice(5).trim();
          }
        }
        if (event === 'token' && data) {
          callbacks.onToken(data);
        } else if (event === 'cards' && data) {
          callbacks.onCards(JSON.parse(data) as ChatCard[]);
        } else if (event === 'done') {
          callbacks.onDone();
        }
      }
    }
    callbacks.onDone();
  } catch (error) {
    callbacks.onError(error);
  }
}
