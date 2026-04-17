import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "company" | "admin" | "developer";
  senderName: string;
  senderAvatar?: string | null;
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string | null;
  participantRole: string;
  lastMessage?: Message | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchConversations(
  token: string | null,
): Promise<Conversation[]> {
  if (!token) return [];
  try {
    const res = await fetchWithRetry(`${apiBaseUrl}/api/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Conversation[];
  } catch {
    return [];
  }
}

export async function fetchMessages(
  token: string | null,
  conversationId: string,
): Promise<Message[]> {
  if (!token) return [];
  try {
    const res = await fetchWithRetry(
      `${apiBaseUrl}/api/messages/conversations/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    return (await res.json()) as Message[];
  } catch {
    return [];
  }
}

export async function sendMessage(
  token: string | null,
  conversationId: string,
  body: string,
): Promise<Message | null> {
  if (!token) return null;
  try {
    const res = await fetchWithRetry(
      `${apiBaseUrl}/api/messages/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as Message;
  } catch {
    return null;
  }
}

export async function startConversation(
  token: string | null,
  participantId: string,
  initialMessage: string,
): Promise<{ conversation: Conversation; message: Message } | null> {
  if (!token) return null;
  try {
    const res = await fetchWithRetry(`${apiBaseUrl}/api/messages/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantId, body: initialMessage }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { conversation: Conversation; message: Message };
  } catch {
    return null;
  }
}

export async function markConversationRead(
  token: string | null,
  conversationId: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetchWithRetry(
      `${apiBaseUrl}/api/messages/conversations/${conversationId}/read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
