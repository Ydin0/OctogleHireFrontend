"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  markConversationRead,
  type Conversation,
  type Message,
} from "@/lib/api/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface ChatWidgetProps {
  accountManagerId?: string;
  accountManagerName?: string;
  accountManagerAvatar?: string | null;
}

export function ChatWidget({
  accountManagerId,
  accountManagerName,
  accountManagerAvatar,
}: ChatWidgetProps) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  // Load conversations
  const loadConversations = useCallback(async () => {
    const token = await getToken();
    const data = await fetchConversations(token);
    setConversations(data);
  }, [getToken]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      loadConversations().finally(() => setLoading(false));
    }
  }, [open, loadConversations]);

  // Load messages for active conversation
  const loadMessages = useCallback(async () => {
    if (!activeConversation) return;
    const token = await getToken();
    const data = await fetchMessages(token, activeConversation.id);
    setMessages(data);
    markConversationRead(token, activeConversation.id);
    // Update unread count locally
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, unreadCount: 0 } : c,
      ),
    );
  }, [activeConversation, getToken]);

  useEffect(() => {
    if (activeConversation) {
      setLoadingMessages(true);
      loadMessages().finally(() => setLoadingMessages(false));
    }
  }, [activeConversation, loadMessages]);

  // Poll for new messages every 5s when conversation is open
  useEffect(() => {
    if (activeConversation && open) {
      pollingRef.current = setInterval(() => {
        loadMessages();
      }, 5000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeConversation, open, loadMessages]);

  // Poll conversations for unread badges (every 15s when widget is closed)
  useEffect(() => {
    if (!open) {
      const interval = setInterval(loadConversations, 15000);
      // Initial load on mount
      loadConversations();
      return () => clearInterval(interval);
    }
  }, [open, loadConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus textarea when conversation opens
  useEffect(() => {
    if (activeConversation) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [activeConversation]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    setDraft("");
    const token = await getToken();

    if (activeConversation) {
      const msg = await sendMessage(token, activeConversation.id, text);
      if (msg) {
        setMessages((prev) => [...prev, msg]);
      }
    } else if (accountManagerId) {
      // Start new conversation with AM
      const result = await startConversation(token, accountManagerId, text);
      if (result) {
        setConversations((prev) => [result.conversation, ...prev]);
        setActiveConversation(result.conversation);
        setMessages([result.message]);
      }
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openAmConversation = () => {
    // Check if there's already an AM conversation
    const existing = conversations.find(
      (c) => c.participantId === accountManagerId,
    );
    if (existing) {
      setActiveConversation(existing);
    } else {
      // Show compose view for AM
      setActiveConversation(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveConversation(null);
    setMessages([]);
  };

  const handleBack = () => {
    setActiveConversation(null);
    setMessages([]);
    setDraft("");
  };

  // Show the "new message to AM" compose view
  const isComposing = !activeConversation && open && accountManagerId;
  const showConvoList =
    !activeConversation && open && !isComposing;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="size-6" />
          {totalUnread > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-pulse text-[10px] font-bold text-pulse-foreground">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              {(activeConversation || isComposing) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <h3 className="text-sm font-semibold">
                {activeConversation
                  ? activeConversation.participantName
                  : isComposing
                    ? accountManagerName ?? "Account Manager"
                    : "Messages"}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleClose}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Conversation List View */}
          {showConvoList && (
            <div className="flex-1 overflow-y-auto">
              {/* Quick action: Message AM */}
              {accountManagerId && accountManagerName && (
                <button
                  type="button"
                  onClick={openAmConversation}
                  className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="relative">
                    <Avatar className="size-10">
                      {accountManagerAvatar && (
                        <AvatarImage
                          src={accountManagerAvatar}
                          alt={accountManagerName}
                        />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(accountManagerName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{accountManagerName}</p>
                    <p className="text-xs text-muted-foreground">
                      Account Manager
                    </p>
                  </div>
                  <Send className="size-4 text-muted-foreground" />
                </button>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <MessageCircle className="mb-3 size-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {accountManagerId
                      ? "Send a message to your account manager to get started."
                      : "Your conversations will appear here."}
                  </p>
                </div>
              ) : (
                conversations
                  .filter(
                    (c) => c.participantId !== accountManagerId,
                  )
                  .map((convo) => (
                    <button
                      key={convo.id}
                      type="button"
                      onClick={() => setActiveConversation(convo)}
                      className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <Avatar className="size-10 shrink-0">
                        {convo.participantAvatar && (
                          <AvatarImage
                            src={convo.participantAvatar}
                            alt={convo.participantName}
                          />
                        )}
                        <AvatarFallback className="text-xs">
                          {getInitials(convo.participantName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {convo.participantName}
                          </p>
                          {convo.lastMessage && (
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {formatTime(convo.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs text-muted-foreground">
                            {convo.lastMessage?.body ?? "No messages yet"}
                          </p>
                          {convo.unreadCount > 0 && (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pulse text-[10px] font-bold text-pulse-foreground">
                              {convo.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          )}

          {/* Messages View (active conversation or composing to AM) */}
          {(activeConversation || isComposing) && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Avatar className="mb-3 size-12">
                      {(activeConversation?.participantAvatar ??
                        accountManagerAvatar) && (
                        <AvatarImage
                          src={
                            (activeConversation?.participantAvatar ??
                              accountManagerAvatar)!
                          }
                          alt={
                            activeConversation?.participantName ??
                            accountManagerName ??
                            ""
                          }
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(
                          activeConversation?.participantName ??
                            accountManagerName ??
                            "AM",
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">
                      {activeConversation?.participantName ??
                        accountManagerName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Send a message to start the conversation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.senderType === "company";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
                              isMe
                                ? "bg-foreground text-background"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.body}
                            </p>
                            <p
                              className={`mt-1 text-[10px] ${
                                isMe
                                  ? "text-background/60"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Compose */}
              <div className="border-t px-3 py-2">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="min-h-[36px] max-h-[100px] resize-none text-sm"
                  />
                  <Button
                    size="icon"
                    className="size-9 shrink-0 rounded-full"
                    disabled={!draft.trim() || sending}
                    onClick={handleSend}
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
