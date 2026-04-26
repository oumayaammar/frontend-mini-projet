"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

type Teacher = {
  firstName?: string
  lastName?: string
}

type ScheduleItem = {
  id: string
  subject: string
  room: string
  dayOfWeek: number
  startTime: string
  endTime: string
  type: string
  teacher?: Teacher
}

type DaySchedule = {
  day: string
  entries: ScheduleItem[]
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number(value))
  return hours * 60 + minutes
}

function getSessionLabel(startTime: string) {
  const slotMap: Record<string, string> = {
    "8:30": "S1",
    "10:10": "S2",
    "11:50": "S3",
    "13:30": "S4",
    "13:50": "S4",
    "15:30": "S5",
    "17:10": "S6",
  }

  return slotMap[startTime] ?? "-"
}

export default function GroupTimetablePage() {
  const params = useParams<{ id: string }>()
  const groupId = params?.id

  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId) return

    let isMounted = true

    async function fetchSchedule() {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(`${API_BASE}/schedule/group/${groupId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error(`Failed to load schedule (${response.status})`)
        }

        const data = (await response.json()) as ScheduleItem[]
        if (!isMounted) return
        setSchedule(Array.isArray(data) ? data : [])
      } catch {
        if (!isMounted) return
        setError("Could not load this group timetable.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void fetchSchedule()

    return () => {
      isMounted = false
    }
  }, [groupId])

  const groupedSchedule = useMemo<DaySchedule[]>(() => {
    const grouped = new Map<string, ScheduleItem[]>()

    for (const entry of schedule) {
      const day = DAYS[entry.dayOfWeek] ?? `Day ${entry.dayOfWeek}`
      if (!grouped.has(day)) grouped.set(day, [])
      grouped.get(day)?.push(entry)
    }

    return Array.from(grouped.entries())
      .sort((a, b) => DAYS.indexOf(a[0]) - DAYS.indexOf(b[0]))
      .map(([day, entries]) => ({
        day,
        entries: entries.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)),
      }))
  }, [schedule])

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-end gap-4 justify-between">
          <div>
            <Link
              href="/timeTablesManagement"
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Group Timetable</h1>
              <p className="text-sm text-muted-foreground">Group: {groupId}</p>
            </div>

          </div>
          <div className="mb-6">
            <Link
              href={`/timeTablesManagement/group/${groupId}/newSchedule`}
              className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Add New Schedule
            </Link>
          </div>
        </header>


        {loading ? <p className="text-sm text-muted-foreground">Loading schedule...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!loading && !error && groupedSchedule.length === 0 ? (
          <p className="text-sm text-muted-foreground">No schedule found for this group.</p>
        ) : null}

        {!loading && !error ? (
          <div className="flex flex-col gap-4">
            {groupedSchedule.map((row) => (
              <div key={row.day} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border bg-secondary/50 px-4 py-3">
                  <h3 className="font-semibold text-foreground">{row.day}</h3>
                </div>
                <div className="grid gap-2 p-3">
                  {row.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-row justify-between gap-5 rounded-lg border-b-2 bg-secondary/30 p-3"
                    >
                      <div className="flex flex-col text-center">
                        <span className="text-s font-medium text-foreground">
                          {getSessionLabel(entry.startTime)}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          ({entry.startTime} - {entry.endTime})
                        </span>
                      </div>
                      <div>
                        <div className="self-end rounded-md px-2 pt-1 text-s text-center">
                          {entry.subject}
                        </div>
                        <div className="self-start rounded-md px-2 pb-1 text-xs font-light text-center">
                          ({entry.teacher?.firstName}{entry.teacher?.lastName})
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row">
                        <div className="self-center rounded-md px-2 pb-1 text-xs font-medium">
                          {entry.room}
                        </div>
                        <div className="self-center rounded-md px-2 pb-1 text-xs font-medium">
                          {entry.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
