"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Users, UserSquare2 } from "lucide-react"

type GroupOption = {
  id: string
  name: string
}

type TeacherOption = {
  id: string
  name: string
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const GROUPS_URL = `${API_BASE}/users/groups`
const USERS_URL = `${API_BASE}/users`

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    for (const key of ["data", "items", "results", "groups", "teachers"]) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

function normalizeGroups(payload: unknown): GroupOption[] {
  return asArray(payload).map((item, index) => {
    if (typeof item === "string") {
      return { id: item, name: item }
    }

    if (item && typeof item === "object") {
      const row = item as Record<string, unknown>
      const id = String(row.id ?? row._id ?? row.groupId ?? row.code ?? `group-${index}`)
      const name = String(row.name ?? row.label ?? row.group ?? id)
      return { id, name }
    }

    const fallback = String(item)
    return { id: fallback, name: fallback }
  })
}

function normalizeTeachers(payload: unknown): TeacherOption[] {
  return asArray(payload)
    .filter((item) => {
      if (!item || typeof item !== "object") return false
      const row = item as Record<string, unknown>
      const role = String(row.role ?? row.userRole ?? "").toLowerCase()
      return role === "teacher"
    })
    .map((item, index) => {
      const row = item as Record<string, unknown>
      const id = String(row.id ?? row._id ?? row.teacherId ?? `teacher-${index}`)
      const composedName = [row.firstName, row.lastName]
        .filter((part) => typeof part === "string" && part.length > 0)
        .join(" ")
      const name = String(row.name ?? composedName ?? row.username ?? row.email ?? id)
      return { id, name }
    })
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export default function TimeTablesManagementPage() {
  const [mode, setMode] = useState<"group" | "teacher">("group")
  const [groups, setGroups] = useState<GroupOption[]>([])
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("auth_token")
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined

      try {
        const groupsResponse = await fetch(GROUPS_URL, { headers })
        const groupsPayload = await parseJson(groupsResponse)
        if (!groupsResponse.ok) {
          throw new Error(`Failed to load groups (${groupsResponse.status})`)
        }

        const groupItems = normalizeGroups(groupsPayload)

        const teachersResponse = await fetch(USERS_URL, { headers })
        const teachersPayload = await parseJson(teachersResponse)
        const teacherItems = teachersResponse.ok ? normalizeTeachers(teachersPayload) : []

        if (!isMounted) return
        setGroups(groupItems)
        setTeachers(teacherItems)
      } catch {
        if (!isMounted) return
        setError("Could not load timetable sources right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const list = useMemo(() => (mode === "group" ? groups : teachers), [groups, mode, teachers])

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-end gap-4 justify-between">
            <div>
                <Link
                    href="/admin-dashboard"
                    className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
                >
                    <ArrowLeft className="size-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Time Tables Management</h1>
                    <p className="text-sm text-muted-foreground">
                    Choose whether you want to open a group or a teacher timetable.
                    </p>
                </div>
            </div>
            <div className="mb-6">
            <Link
                href="/timeTablesManagement/newSchedule"
                className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
                Add New Schedule
            </Link>
            </div>
        </header>


        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("group")}
            className={`rounded-xl border flex gap-4 p-8 text-left transition ${
              mode === "group"
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <Users className="mb-2 size-7" />
            <h2 className="font-semibold text-xl">Group Time Tables</h2>
          </button>

          <button
            type="button"
            onClick={() => setMode("teacher")}
            className={`rounded-xl border p-8 flex gap-4  text-left transition ${
              mode === "teacher"
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <UserSquare2 className="mb-2 size-7" />
            <h2 className="font-semibold text-xl">Teacher Time Tables</h2>
          </button>
        </div>

        {loading ? <p className="text-sm text-muted-foreground">Loading list...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!loading && !error && list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No {mode === "group" ? "groups" : "teachers"} were found.
          </p>
        ) : null}

        {!loading && !error && list.length > 0 ? (
          <div className="grid gap-3">
            {list.map((item) => (
              <Link
                key={item.id}
                href={
                  mode === "group"
                    ? `/timeTablesManagement/group/${item.id}`
                    : `/timeTablesManagement/teacher/${item.id}`
                }
                className="rounded-xl border border-border bg-card p-4 transition hover:bg-secondary/50"
              >
                <p className="font-medium text-foreground">{item.name}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
