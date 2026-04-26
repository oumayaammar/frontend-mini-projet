"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

type ReceiverType = "ALL" | "ROLE" | "GROUP" | "USER"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const USERS_URL = `${API_BASE}/users`
const THREADS_URL = `${API_BASE}/forum/threads`
function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    for (const key of ["data", "items", "results", "users", "groups"]) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

function normalizeAgentTypes(payload: unknown): string[] {
  return asArray(payload)
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
}

function normalizeGroups(payload: unknown): string[] {
  const arr = asArray(payload)
  return arr
    .map((item) => {
      if (typeof item === "string") return item.trim()
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>
        const name =
          (typeof o.name === "string" && o.name) ||
          (typeof o.label === "string" && o.label) ||
          (typeof o.title === "string" && o.title) ||
          ""
        return String(name).trim()
      }
      return ""
    })
    .filter(Boolean)
}

type User = {
  username : string
  firstName : string
  lastName : string
  email : string
  role : string 
  agentType : string
  studentGroup : string
  department : string
}

function normalizeUsers(payload: unknown): User[] {
  return asArray(payload)
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((row) => ({
      username: String(row.username ?? ""),
      firstName: String(row.firstName ?? ""),
      lastName: String(row.lastName ?? ""),
      email: String(row.email ?? ""),
      role: String(row.role ?? ""),
      agentType: String(row.agentType ?? ""),
      studentGroup: String(row.studentGroup ?? ""),
      department: String(row.department ?? ""),
    }))
}

export default function ProfessorNewConversationPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [receiverType, setReceiverType] = useState<ReceiverType>("ALL")
  const [receiverValue, setReceiverValue] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [usernames, setUsernames] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [usersData, setUsersData] = useState<User[]>([])
  const [agentTypes, setAgentTypes] = useState<string[]>([])

  const needsReceiverValue = receiverType !== "ALL"

  useEffect(() => {
    let isMounted = true

    async function fetchUsers() {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(USERS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`)
        }

        const payload = (await response.json()) as unknown
        if (!isMounted) return
        setUsersData(normalizeUsers(payload))

      } catch {
        if (!isMounted) return
        setUsersData([])
      }
    }

    void fetchUsers()
    return () => {
      isMounted = false
    }
  }, [])

  const canSubmit =
    title.trim().length > 0 &&
    (!needsReceiverValue || receiverValue.trim().length > 0) &&
    !submitting

  useEffect(() => {
    const nextUsernames = Array.from(
      new Set(usersData.map((user) => user.username).map((v) => v.trim()).filter(Boolean))
    )
    const nextGroups = Array.from(
      new Set(usersData.map((user) => user.studentGroup).map((v) => v.trim()).filter(Boolean))
    )
    const nextAgentTypes = Array.from(
      new Set(usersData.map((user) => user.agentType).map((v) => v.trim()).filter(Boolean))
    )

    setUsernames(nextUsernames)
    setGroups(nextGroups)
    setAgentTypes(nextAgentTypes)
  }, [usersData])

  const receiverValueOptions = useMemo(() => {
    switch (receiverType) {
      case "USER":
        return usernames
      case "GROUP":
        return groups
      case "ROLE":
        return agentTypes
      default:
        return []
    }
  }, [receiverType, usernames, groups, agentTypes])

  async function handleCreateConversation() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem("auth_token")
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`

      const payload = {
        title: title.trim(),
        receiverType,
        receiverValue: receiverType === "ALL" ? null : receiverValue.trim(),
        isPrivate,
      }

      const response = await fetch(THREADS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Create thread failed (${response.status})`)

      const created = (await response.json()) as { id?: string }
      const id = String(created?.id ?? "").trim()
      router.push(id ? `/professor/messages?threadId=${encodeURIComponent(id)}` : "/professor/messages")
    } catch {
      // keep UI simple (no toast in this codebase)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card p-4">
        <Link href="/professor/messages">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">New Conversation</h1>
      </header>

      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Problème datashow salle A2"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Receiver type
          </label>
          <select
            value={receiverType}
            onChange={(e) => setReceiverType(e.target.value as ReceiverType)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">ALL</option>
            <option value="ROLE">ROLE</option>
            <option value="GROUP">GROUP</option>
            <option value="USER">USER</option>
          </select>

          {needsReceiverValue ? (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Receiver value
              </label>
              <select id="receiver-tags" onChange={(e) => setReceiverValue(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {receiverValueOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              For <span className="font-medium">ALL</span>, receiverValue will be <span className="font-medium">null</span>.
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="size-4"
          />
          <span className="text-sm text-foreground">Private conversation</span>
        </label>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-4">
        <Button
          onClick={handleCreateConversation}
          disabled={!canSubmit}
          className="w-full gap-2"
          size="lg"
        >
          <Send className="size-4" />
          {submitting ? "Creating..." : "Create Conversation"}
        </Button>
      </div>
    </div>
  )
}
