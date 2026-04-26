'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar?: string
  online?: boolean
  unread?: number
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary',
              selectedId === conversation.id && 'bg-secondary'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-foreground text-sm">{conversation.name}</h3>
                  {conversation.online && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground mt-1">{conversation.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                {conversation.unread && conversation.unread > 0 && (
                  <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
