"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
  

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, Edit, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ConversationList } from "../../components/conversation-list"
import { ChatView } from "../../components/chat-view"
import { EmptyChat } from "../../components/empty-chat"


const CURRENT_USER_ID = "user-1"

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Creative Director",
    lastMessage: "Great work on the slides! Love it! Just one more thing...",
    timestamp: "13:53",
    online: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    lastMessage: "The new designs look amazing!",
    timestamp: "12:30",
    unread: 2,
    online: true,
  },
  {
    id: "3",
    name: "Design Team",
    lastMessage: "Alex: Can we review the mockups?",
    timestamp: "11:15",
  },
  {
    id: "4",
    name: "Marcus Johnson",
    lastMessage: "Thanks for your help yesterday",
    timestamp: "Yesterday",
    online: false,
  },
  {
    id: "5",
    name: "Product Team",
    lastMessage: "Meeting scheduled for tomorrow at 2pm",
    timestamp: "Yesterday",
  },
  {
    id: "6",
    name: "Emma Wilson",
    lastMessage: "I&apos;ll send you the files shortly",
    timestamp: "Monday",
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
      senderName: "Creative Director",
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
      senderName: "Creative Director",
    },
  ],
  "2": [
    {
      id: "m4",
      content: "Hi! Just wanted to share some feedback on the latest iteration.",
      timestamp: "12:15",
      senderId: "other",
      senderName: "Sarah Chen",
    },
    {
      id: "m5",
      content: "Of course, I&apos;d love to hear your thoughts!",
      timestamp: "12:20",
      senderId: CURRENT_USER_ID,
      senderName: "You",
    },
    {
      id: "m6",
      content: "The new designs look amazing!",
      timestamp: "12:30",
      senderId: "other",
      senderName: "Sarah Chen",
    },
  ],
}

export default function MessagingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("1")
  const [messages, setMessages] = useState(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Check for new conversation from URL params
  useEffect(() => {
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
        senderId: CURRENT_USER_ID,
        senderName: "You",
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

  const handleSendMessage = (content: string) => {
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

    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        newMessage,
      ],
    }))

    // Update last message in conversation
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: content, timestamp: newMessage.timestamp }
          : c
      )
    )
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
