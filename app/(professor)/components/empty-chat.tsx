import { MessageSquare } from "lucide-react"

export function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <div className="rounded-full bg-secondary p-6">
        <MessageSquare className="size-12 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Select a conversation</h3>
        <p className="mt-1 text-sm">Choose a conversation from the list to start messaging</p>
      </div>
    </div>
  )
}
