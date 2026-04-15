"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, X, Send, Users, BookOpen, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Recipient {
  id: string
  name: string
  type: "user" | "group" | "subject" | "all"
  avatar?: string
}

const suggestions: Recipient[] = [
  { id: "all", name: "All", type: "all" },
  { id: "g1", name: "Design Team", type: "group" },
  { id: "g2", name: "Product Team", type: "group" },
  { id: "g3", name: "Engineering", type: "group" },
  { id: "m1", name: "Mathematics", type: "subject" },
  { id: "m2", name: "Physics", type: "subject" },
  { id: "m3", name: "Computer Science", type: "subject" },
  { id: "m4", name: "Biology", type: "subject" },
  { id: "u1", name: "Sarah Chen", type: "user", avatar: "" },
  { id: "u2", name: "Marcus Johnson", type: "user", avatar: "" },
  { id: "u3", name: "Emma Wilson", type: "user", avatar: "" },
  { id: "u4", name: "Alex Thompson", type: "user", avatar: "" },
  { id: "u5", name: "Creative Director", type: "user", avatar: "" },
  { id: "u6", name: "John Smith", type: "user", avatar: "" },
  { id: "u7", name: "Lisa Anderson", type: "user", avatar: "" },
]

function getTypeIcon(type: Recipient["type"]) {
  switch (type) {
    case "group":
      return <Users className="size-4" />
    case "subject":
      return <BookOpen className="size-4" />
    case "all":
      return <Globe className="size-4" />
    default:
      return null
  }
}

function getTypeLabel(type: Recipient["type"]) {
  switch (type) {
    case "group":
      return "Group"
    case "subject":
      return "Subject"
    case "all":
      return "Everyone"
    default:
      return "User"
  }
}

function getTypeBgColor(type: Recipient["type"]) {
  switch (type) {
    case "group":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "subject":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    case "all":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

export default function NewConversationPage() {
  const [inputValue, setInputValue] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([])
  const [message, setMessage] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter((s) => {
    const isNotSelected = !selectedRecipients.some((r) => r.id === s.id)
    const searchTerm = inputValue.startsWith("@") ? inputValue.slice(1) : inputValue
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    return isNotSelected && matchesSearch
  })

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(value.length > 0 || value === "@")
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && selectedRecipients.length > 0) {
      // Remove last recipient when backspace on empty input
      setSelectedRecipients((prev) => prev.slice(0, -1))
    }
    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const addRecipient = (recipient: Recipient) => {
    setSelectedRecipients((prev) => [...prev, recipient])
    setInputValue("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeRecipient = (id: string) => {
    setSelectedRecipients((prev) => prev.filter((r) => r.id !== id))
  }

  const handleCreateConversation = () => {
    if (selectedRecipients.length === 0 || message.trim() === "") return
    // Here you would typically send to an API
    alert(`Creating conversation with: ${selectedRecipients.map((r) => r.name).join(", ")}\nMessage: ${message}`)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card p-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">New Conversation</h1>
      </header>

      {/* Recipients Section */}
      <div className="border-b border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          To:
        </label>
        <div ref={containerRef} className="relative">
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-xl border border-input bg-secondary/30 p-2 transition-colors",
              showSuggestions && "border-primary ring-1 ring-primary/20"
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Selected Recipients Tags */}
            {selectedRecipients.map((recipient) => (
              <span
                key={recipient.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium",
                  getTypeBgColor(recipient.type)
                )}
              >
                {getTypeIcon(recipient.type)}
                <span>@{recipient.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeRecipient(recipient.id)
                  }}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0 || true)}
              placeholder={selectedRecipients.length === 0 ? "Type @ to add recipients..." : ""}
              className="min-w-32 flex-1 border-none bg-transparent px-1 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <ScrollArea className="max-h-64">
                <div className="p-2">
                  {/* All option */}
                  {filteredSuggestions.some((s) => s.type === "all") && (
                    <div className="mb-2">
                      <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Broadcast
                      </p>
                      {filteredSuggestions
                        .filter((s) => s.type === "all")
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => addRecipient(suggestion)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                              <Globe className="size-5" />
                            </span>
                            <div>
                              <p className="font-medium text-foreground">@{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground">Send to everyone</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Groups */}
                  {filteredSuggestions.some((s) => s.type === "group") && (
                    <div className="mb-2">
                      <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Groups
                      </p>
                      {filteredSuggestions
                        .filter((s) => s.type === "group")
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => addRecipient(suggestion)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                              <Users className="size-5" />
                            </span>
                            <div>
                              <p className="font-medium text-foreground">@{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground">{getTypeLabel(suggestion.type)}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Subjects */}
                  {filteredSuggestions.some((s) => s.type === "subject") && (
                    <div className="mb-2">
                      <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Subjects
                      </p>
                      {filteredSuggestions
                        .filter((s) => s.type === "subject")
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => addRecipient(suggestion)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                              <BookOpen className="size-5" />
                            </span>
                            <div>
                              <p className="font-medium text-foreground">@{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground">{getTypeLabel(suggestion.type)}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Users */}
                  {filteredSuggestions.some((s) => s.type === "user") && (
                    <div>
                      <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Users
                      </p>
                      {filteredSuggestions
                        .filter((s) => s.type === "user")
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => addRecipient(suggestion)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                          >
                            <Avatar className="size-10">
                              <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {suggestion.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">@{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground">{getTypeLabel(suggestion.type)}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Selected count */}
        {selectedRecipients.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedRecipients.length} recipient{selectedRecipients.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {/* Message Compose Area */}
      <div className="flex flex-1 flex-col p-4">
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          Message:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          className="flex-1 resize-none rounded-xl border border-input bg-secondary/30 p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-4">
        <Button
          onClick={handleCreateConversation}
          disabled={selectedRecipients.length === 0 || message.trim() === ""}
          className="w-full gap-2"
          size="lg"
        >
          <Send className="size-4" />
          Create Conversation
        </Button>
      </div>
    </div>
  )
}
