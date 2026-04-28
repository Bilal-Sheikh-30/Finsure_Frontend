import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { askChatbot, ChatTurn } from "./chatApi";
import { useAuth } from "../../contexts/AuthContext";

/** Single message stored in the UI - adds id and timestamps on top of the wire format. */
export interface ChatMessage extends ChatTurn {
  id: string;
  createdAt: number;
  error?: boolean;
}

interface ChatbotContextValue {
  messages: ChatMessage[];
  isOpen: boolean;
  isSending: boolean;
  unread: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  send: (text: string) => Promise<void>;
  clear: () => void;
  markRead: () => void;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

// Per-user storage keys — two users on the same browser must never see each
// other's chats. Legacy key is migrated once into the current user's bucket.
const STORAGE_PREFIX = "finsure.chatbot.messages";
const LEGACY_KEY = "finsure.chatbot.messages";
const HISTORY_WINDOW = 6; // how many recent turns to send to the backend

const storageKeyFor = (userId: string | null | undefined) =>
  `${STORAGE_PREFIX}:${userId ?? "anon"}`;

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const greeting = (): ChatMessage => ({
  id: makeId(),
  role: "assistant",
  content:
    "Hi! I'm the **FINSURE Assistant**. Ask me about uploading documents, reviewing extracted transactions, generating reports, dashboards, security, or anything else about the app.",
  createdAt: Date.now(),
});

function loadForUser(userId: string | null | undefined): ChatMessage[] {
  if (typeof window === "undefined") return [greeting()];
  try {
    const key = storageKeyFor(userId);
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // One-time migration for the first authenticated user on this browser:
    // only honor the legacy global key if no per-user record exists yet. It is
    // then removed so other accounts on this device can't inherit it.
    if (userId) {
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        window.localStorage.removeItem(LEGACY_KEY);
        const parsed = JSON.parse(legacy) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          window.localStorage.setItem(key, legacy);
          return parsed;
        }
      }
    }
    return [greeting()];
  } catch {
    return [greeting()];
  }
}

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?.userID ?? null;

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadForUser(userId),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const inflight = useRef<AbortController | null>(null);
  const activeUserRef = useRef<string | null>(userId);

  // When the logged-in user changes (login / logout / account switch), swap
  // the conversation to that user's private history so one account never
  // sees another's turns.
  useEffect(() => {
    if (activeUserRef.current === userId) return;
    activeUserRef.current = userId;
    inflight.current?.abort();
    inflight.current = null;
    setIsSending(false);
    setUnread(0);
    setMessages(loadForUser(userId));
  }, [userId]);

  // Persist conversation into the current user's bucket.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKeyFor(userId),
        JSON.stringify(messages),
      );
    } catch {
      // ignore quota errors
    }
  }, [messages, userId]);

  const open = useCallback(() => {
    setIsOpen(true);
    setUnread(0);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(
    () =>
      setIsOpen((v) => {
        if (!v) setUnread(0);
        return !v;
      }),
    [],
  );
  const markRead = useCallback(() => setUnread(0), []);

  const clear = useCallback(() => {
    inflight.current?.abort();
    inflight.current = null;
    setMessages([greeting()]);
    setIsSending(false);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      // Snapshot history *before* we append so we send exactly the prior turns
      // to the backend (not the new user message - that goes in `query`).
      const historyForApi: ChatTurn[] = messages
        .filter((m) => !m.error)
        .slice(-HISTORY_WINDOW)
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);

      const controller = new AbortController();
      inflight.current = controller;

      try {
        const response = await askChatbot({
          query: trimmed,
          history: historyForApi,
          signal: controller.signal,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: response,
            createdAt: Date.now(),
          },
        ]);

        // Bump unread only if the widget/panel is closed when the reply arrives.
        setUnread((u) => (isOpen ? u : u + 1));
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ||
          (err as Error)?.message ||
          "Something went wrong. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: `⚠️ ${detail}`,
            createdAt: Date.now(),
            error: true,
          },
        ]);
      } finally {
        if (inflight.current === controller) inflight.current = null;
        setIsSending(false);
      }
    },
    [messages, isOpen, isSending],
  );

  const value = useMemo<ChatbotContextValue>(
    () => ({
      messages,
      isOpen,
      isSending,
      unread,
      open,
      close,
      toggle,
      send,
      clear,
      markRead,
    }),
    [
      messages,
      isOpen,
      isSending,
      unread,
      open,
      close,
      toggle,
      send,
      clear,
      markRead,
    ],
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx)
    throw new Error("useChatbot must be used inside a <ChatbotProvider>");
  return ctx;
}
