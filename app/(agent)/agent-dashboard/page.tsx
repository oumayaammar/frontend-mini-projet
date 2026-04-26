"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CalendarClock, Clock, Inbox, Newspaper, Pin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type ApiNews = {
  id?: string
  _id?: string
  title?: string
  content?: string
  imageUrl?: string | null
  isPinned?: boolean
  targetGroup?: string | null
  createdAt?: string
}

type ApiSchedule = {
  id?: string
  subject?: string
  room?: string
  dayOfWeek?: number
  startTime?: string
  endTime?: string
}

type DashboardNewsItem = {
  id: string
  title: string
  content: string
  isPinned: boolean
  targetGroup: string
  createdAt: string
}

type DashboardScheduleItem = {
  id: string
  subject: string
  room: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")
const NEWS_URL = `${API_BASE}/news`
const SCHEDULE_URL = `${API_BASE}/schedule`

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    for (const key of ["data", "items", "results", "news", "schedule"]) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number(value))
  return hours * 60 + minutes
}

export default function AgentDashboardPage() {
  const [newsItems, setNewsItems] = useState<DashboardNewsItem[]>([])
  const [todaySchedule, setTodaySchedule] = useState<DashboardScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("auth_token")
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined

        const [newsResponse, scheduleResponse] = await Promise.all([
          fetch(NEWS_URL, { headers }),
          fetch(SCHEDULE_URL, { headers }),
        ])

        if (!newsResponse.ok) throw new Error(`News failed (${newsResponse.status})`)
        if (!scheduleResponse.ok) throw new Error(`Schedule failed (${scheduleResponse.status})`)

        const newsPayload = (await newsResponse.json()) as unknown
        const schedulePayload = (await scheduleResponse.json()) as unknown

        const news = (asArray(newsPayload) as ApiNews[]).map((item, index) => ({
          id: String(item.id ?? item._id ?? `news-${index}`),
          title: String(item.title ?? ""),
          content: String(item.content ?? ""),
          isPinned: Boolean(item.isPinned),
          targetGroup: String(item.targetGroup ?? "General"),
          createdAt: String(item.createdAt ?? new Date().toISOString()),
        }))

        const schedule = (asArray(schedulePayload) as ApiSchedule[]).map((item, index) => ({
          id: String(item.id ?? `schedule-${index}`),
          subject: String(item.subject ?? ""),
          room: String(item.room ?? ""),
          dayOfWeek: Number(item.dayOfWeek ?? -1),
          startTime: String(item.startTime ?? ""),
          endTime: String(item.endTime ?? ""),
        }))

        const today = new Date().getDay()
        const todayRows = schedule
          .filter((item) => item.dayOfWeek === today)
          .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))

        if (!isMounted) return
        setNewsItems(news)
        setTodaySchedule(todayRows)
      } catch {
        if (!isMounted) return
        setError("Could not load dashboard data right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const pinnedNews = useMemo(
    () =>
      [...newsItems]
        .filter((item) => item.isPinned)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [newsItems],
  )

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  )

  return (
    <div className="min-h-screen bg-background p-5">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Agent Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Quick view of inbox, announcements and today&apos;s schedule.
        </p>
      </header>

      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading dashboard...</p> : null}
      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Inbox className="size-4 text-primary" />
              Inbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Messages</p>
            <Link href="/agent/inbox" className="mt-2 inline-flex text-sm text-primary hover:underline">
              Open inbox
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Newspaper className="size-4 text-primary" />
              News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{newsItems.length}</p>
            <Link href="/agent/news" className="mt-2 inline-flex text-sm text-primary hover:underline">
              Read all news
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todaySchedule.length} events</p>
            <p className="mt-2 text-xs text-muted-foreground">{todayLabel}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <CardTitle>Today&apos;s Schedule</CardTitle>
            </div>
            <CardDescription>{todayLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Room</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.startTime}</TableCell>
                        <TableCell>{item.endTime}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.room}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No events scheduled for today.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="size-5 text-primary" />
                <CardTitle>Pinned News</CardTitle>
              </div>
              <Link href="/agent/news">
                <Button variant="ghost" size="sm" className="gap-1">
                  View <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Important announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pinnedNews.length > 0 ? (
                pinnedNews.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-3">
                    <p className="line-clamp-1 font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.targetGroup} - {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No pinned news available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
