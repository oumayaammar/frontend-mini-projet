"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react"

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  senderName: string
  senderAvatar?: string
}

interface ChatViewProps {
  messages: Message[]
  currentUserId: string
  recipientName: string
  recipientAvatar?: string
  recipientOnline?: boolean
  onSendMessage: (content: string) => void
}

export function ChatView({
  messages,
  currentUserId,
  recipientName,
  recipientAvatar,
  recipientOnline,
  onSendMessage,
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {recipientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {recipientOnline && (
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{recipientName}</h2>
            <p className="text-xs text-muted-foreground">
              {recipientOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Phone className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Video className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="size-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <div
                key={message.id}
                className={cn("flex gap-3", isOwn && "flex-row-reverse")}
              >
                {!isOwn && (
                  <Avatar className="size-8 mt-1">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {message.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex max-w-[70%] flex-col gap-1",
                    isOwn && "items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Paperclip className="size-5" />
          </Button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile className="size-5" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0 size-11 rounded-xl"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
