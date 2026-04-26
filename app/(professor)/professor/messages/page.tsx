"use client"

import { useCallback, useMemo, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
  
import { ChatView, type Message } from "../../components/chat-view"
import { EmptyChat } from "../../components/empty-chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, Edit, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Conversation, ConversationList } from "../../components/conversation-list"
import { getStoredAuthUser, getUserDisplayName } from "@/lib/auth-client"

type ApiThreadMessage = {
  id?: string
  content?: string
  attachmentUrl?: string | null
  senderId?: string
  threadId?: string
  createdAt?: string
  sender?: {
    id?: string
    firstName?: string
    lastName?: string
    username?: string
  } | null
}

type ApiThread = {
  id?: string
  title?: string
  createdAt?: string
  updatedAt?: string
  receiverDisplay?: string
  unreadCount?: number
  messages?: ApiThreadMessage[]
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")
const THREADS_URL = `${API_BASE}/forum/threads`

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    for (const key of ["data", "items", "results", "threads"]) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

function formatTime(iso: string | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function pickThreadDisplayName(thread: ApiThread) {
  const receiver = String(thread.receiverDisplay ?? "").trim()
  if (receiver) return receiver
  const title = String(thread.title ?? "").trim()
  if (title) return title
  return "Conversation"
}

function pickThreadLastMessage(thread: ApiThread) {
  const msgs = thread.messages ?? []
  const last = msgs[msgs.length - 1]
  const content = String(last?.content ?? "").trim()
  if (content) return content
  return "No messages yet"
}

export default function MessagingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const currentUserId = useMemo(() => {
    const user = getStoredAuthUser()
    const id = (user && typeof user.id === "string" && user.id) || ""
    return id || "current-user"
  }, [])

  const currentUserName = useMemo(() => {
    const user = getStoredAuthUser()
    return getUserDisplayName(user)
  }, [])

  const loadThreads = useCallback(
    async ({ silent }: { silent?: boolean } = {}) => {
      if (!silent) setLoading(true)
      try {
        const token = localStorage.getItem("auth_token")
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined
        const response = await fetch(THREADS_URL, { headers })
        if (!response.ok) throw new Error(`Threads failed (${response.status})`)

        const payload = (await response.json()) as unknown
        const threads = asArray(payload) as ApiThread[]

        const nextConversations: Conversation[] = threads.map((thread, index) => ({
          id: String(thread.id ?? `thread-${index}`),
          name: pickThreadDisplayName(thread),
          lastMessage: pickThreadLastMessage(thread),
          timestamp: formatTime(thread.updatedAt ?? thread.createdAt) || "",
          unread: Number(thread.unreadCount ?? 0) || 0,
          online: false,
        }))

        const nextMessages: Record<string, Message[]> = {}
        for (const thread of threads) {
          const threadId = String(thread.id ?? "")
          if (!threadId) continue

          nextMessages[threadId] = (thread.messages ?? []).map((m, index) => ({
            id: String(m.id ?? `${threadId}-m-${index}`),
            content: String(m.content ?? ""),
            timestamp: formatTime(m.createdAt) || "",
            senderId: String(m.senderId ?? m.sender?.id ?? ""),
            senderName:
              String(m.sender?.username ?? "").trim() ||
              `${String(m.sender?.firstName ?? "").trim()} ${String(m.sender?.lastName ?? "").trim()}`.trim() ||
              "User",
          }))
        }

        setConversations(nextConversations)
        setMessages(nextMessages)
        setSelectedConversationId((prev) => prev ?? nextConversations[0]?.id ?? null)
      } catch {
        if (!silent) {
          setConversations([])
          setMessages({})
          setSelectedConversationId(null)
        }
      } finally {
        if (!silent) setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    void loadThreads()
  }, [loadThreads])

  // "Realtime" updates via polling + focus refresh
  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadThreads({ silent: true })
    }, 4000)

    const onFocus = () => {
      void loadThreads({ silent: true })
    }

    window.addEventListener("focus", onFocus)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", onFocus)
    }
  }, [loadThreads])

  // Check for new conversation from URL params
  useEffect(() => {
    const threadId = searchParams.get("threadId")
    if (threadId) {
      setSelectedConversationId(threadId)
      router.replace("/messages")
      return
    }

    const conversationName = searchParams.get("conversationName")
    const conversationMessage = searchParams.get("conversationMessage")

    if (conversationName && conversationMessage) {
      const newConversationId = `conv-${Date.now()}`

      // Create new conversation
      const newConversation: Conversation = {
        id: newConversationId,
        name: conversationName,
        lastMessage: conversationMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        online: false,
      }

      // Create initial message
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        content: conversationMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        senderId: currentUserId,
        senderName: currentUserName,
      }

      setConversations((prev) => [newConversation, ...prev])
      setMessages((prev) => ({
        ...prev,
        [newConversationId]: [newMessage],
      }))
      setSelectedConversationId(newConversationId)

      // Clear search params after handling
      router.replace("/messages")
    }
  }, [searchParams, router])

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return

    const optimisticId = `optimistic-${Date.now()}`
    const optimisticMessage: Message = {
      id: optimisticId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      senderId: currentUserId,
      senderName: currentUserName,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), optimisticMessage],
    }))
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: content, timestamp: optimisticMessage.timestamp }
          : c
      )
    )

    setSending(true)
    try {
      const token = localStorage.getItem("auth_token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await fetch(`${API_BASE}/forum/threads/${selectedConversationId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error(`Send failed (${response.status})`)

      // After successful send, refresh from server to keep UI in sync (realtime-ish).
      await loadThreads({ silent: true })
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: (prev[selectedConversationId] || []).filter((m) => m.id !== optimisticId),
      }))
      // Best-effort refresh to restore correct lastMessage/timestamp
      void loadThreads({ silent: true })
    } finally {
      setSending(false)
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setIsSidebarOpen(false)
    // Clear unread when selecting
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Messenger</h1>
          <div className="flex items-center gap-1">
            <Link href="/messages/new-message">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Edit className="size-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-transparent focus:border-input"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={filteredConversations}
          selectedId={selectedConversationId}
          onSelect={handleSelectConversation}
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-background">
        {/* Mobile Header */}
        <div className="flex items-center gap-3 border-b border-border bg-card p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="font-semibold text-foreground">
            {selectedConversation?.name || "Messenger"}
          </h1>
        </div>

        {/* Chat View or Empty State */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : selectedConversation ? (
            <ChatView
              messages={messages[selectedConversationId!] || []}
              currentUserId={currentUserId}
              recipientName={selectedConversation.name}
              recipientAvatar={selectedConversation.avatar}
              recipientOnline={selectedConversation.online}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <EmptyChat />
          )}
        </div>
      </main>
    </div>
  )
}
