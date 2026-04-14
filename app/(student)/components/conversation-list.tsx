"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread?: number
  online?: boolean
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-3">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-secondary/80",
              selectedId === conversation.id && "bg-secondary"
            )}
          >
            <div className="relative">
              <Avatar className="size-12">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {conversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-emerald-500" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground truncate">
                  {conversation.name}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && conversation.unread > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
