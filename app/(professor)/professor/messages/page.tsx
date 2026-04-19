"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, Edit, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ConversationList, type Conversation } from "../../components/conversation-list"
import { ChatView, type Message } from "../../components/chat-view"
import { EmptyChat } from "../../components/empty-chat"

const CURRENT_USER_ID = "professor-1"
const STORAGE_KEY = "professor_conversations"
const MESSAGES_STORAGE_KEY = "professor_messages"

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Group A1",
    lastMessage: "Great work on the slides! Love it! Just one more thing...",
    timestamp: "13:53",
    online: true,
  },
  {
    id: "2",
    name: "Group B2",
    lastMessage: "The new designs look amazing!",
    timestamp: "12:30",
    unread: 2,
    online: true,
  },
]

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Hey! Are you here?",
      timestamp: "13:53",
      senderId: "other",
      senderName: "Group A1",
    },
    {
      id: "m2",
      content: "Yeah...",
      timestamp: "13:53",
      senderId: CURRENT_USER_ID,
      senderName: "You",
    },
    {
      id: "m3",
      content: "Great work on the slides! Love it! Just one more thing...",
      timestamp: "13:53",
      senderId: "other",
      senderName: "Group A1",
    },
  ],
  "2": [
    {
      id: "m4",
      content: "Hi! Just wanted to share some feedback on the latest iteration.",
      timestamp: "12:15",
      senderId: "other",
      senderName: "Group B2",
    },
    {
      id: "m5",
      content: "Of course, I'd love to hear your thoughts!",
      timestamp: "12:20",
      senderId: CURRENT_USER_ID,
      senderName: "You",
    },
    {
      id: "m6",
      content: "The new designs look amazing!",
      timestamp: "12:30",
      senderId: "other",
      senderName: "Group B2",
    },
  ],
}

export default function ProfessorMessagingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const hasProcessedParams = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY)
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY)

    setConversations(
      savedConversations ? JSON.parse(savedConversations) : initialConversations
    )
    setMessages(
      savedMessages ? JSON.parse(savedMessages) : initialMessages
    )
    setSelectedConversationId("1")
    setIsHydrated(true)
  }, [])

  // Check for new conversation from URL params - only process once
  useEffect(() => {
    if (!isHydrated || hasProcessedParams.current) return

    const conversationName = searchParams.get("conversationName")
    const conversationMessage = searchParams.get("conversationMessage")

    if (!conversationName || !conversationMessage) return

    hasProcessedParams.current = true

    // Load current state from localStorage to avoid stale state
    const currentConversations = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || JSON.stringify(initialConversations)
    )
    const currentMessages = JSON.parse(
      localStorage.getItem(MESSAGES_STORAGE_KEY) || JSON.stringify(initialMessages)
    )

    // Check if conversation already exists
    const existingConversation = currentConversations.find(
      (c: Conversation) => c.name.toLowerCase() === conversationName.toLowerCase()
    )

    let targetConversationId = ""
    let updatedConversations = currentConversations
    let updatedMessages = { ...currentMessages }

    if (existingConversation) {
      // Update existing conversation
      targetConversationId = existingConversation.id
      updatedConversations = currentConversations.map((c: Conversation) =>
        c.id === existingConversation.id
          ? {
              ...c,
              lastMessage: conversationMessage,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : c
      )
    } else {
      // Create new conversation
      targetConversationId = `conv-${Date.now()}`

      const newConversation: Conversation = {
        id: targetConversationId,
        name: conversationName,
        lastMessage: conversationMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        online: false,
      }

      updatedConversations = [newConversation, ...currentConversations]
    }

    // Add message to only the target conversation
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content: conversationMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      senderId: CURRENT_USER_ID,
      senderName: "You",
    }

    updatedMessages[targetConversationId] = [
      ...(updatedMessages[targetConversationId] || []),
      newMessage,
    ]

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConversations))
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages))

    // Update state
    setConversations(updatedConversations)
    setMessages(updatedMessages)
    setSelectedConversationId(targetConversationId)

    // Clear search params after handling
    router.replace("/professor/messages")
  }, [isHydrated, searchParams, router])

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = useCallback((content: string) => {
    if (!selectedConversationId) return

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      senderId: CURRENT_USER_ID,
      senderName: "You",
    }

    setMessages((prev) => {
      const updated = {
        ...prev,
        [selectedConversationId]: [
          ...(prev[selectedConversationId] || []),
          newMessage,
        ],
      }
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    // Update last message in conversation
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: content, timestamp: newMessage.timestamp }
          : c
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [selectedConversationId])

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id)
    setIsSidebarOpen(false)
    setConversations((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  if (!isHydrated) {
    return <div />
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
            <Link href="/professor/messages/new-message">
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
          {selectedConversation ? (
            <ChatView
              messages={messages[selectedConversationId!] || []}
              currentUserId={CURRENT_USER_ID}
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
