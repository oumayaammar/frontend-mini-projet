"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

const SCHEDULE_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/schedule`
    : null) ?? "http://localhost:3002/schedule"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number(value))
  return hours * 60 + minutes
}

function getTeacherName(teacher?: Teacher) {
  const fullName = [teacher?.firstName, teacher?.lastName].filter(Boolean).join(" ")
  return fullName || "No teacher"
}

export default function TimetablePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(SCHEDULE_URL, {
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
        setError("Could not load your schedule right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchSchedule()

    return () => {
      isMounted = false
    }
  }, [])

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
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Class Timetable</h1>
            <p className="text-sm text-muted-foreground">Academic Year 2025-2026</p>
          </div>
        </header>

        {loading ? <p className="text-sm text-muted-foreground">Loading schedule...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!loading && !error && groupedSchedule.length === 0 ? (
          <p className="text-sm text-muted-foreground">No schedule found.</p>
        ) : null}

        {!loading && !error ? (
          <div className="flex flex-col gap-4">
            {groupedSchedule.map((row) => (
              <div key={row.day} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border bg-secondary/50 px-4 py-3">
                  <h3 className="font-semibold text-foreground">{row.day}</h3>
                </div>
                <div className="grid gap-2 p-3">
                  {row.entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex flex-row justify-between gap-5 rounded-lg border-b-2 bg-secondary/30 p-3"
                    >
                      <div className="flex flex-col text-center">
                        <span className="text-s font-medium text-foreground">S{index + 1}</span>
                        <span className="text-xs font-medium text-muted-foreground">
                          ({entry.startTime} - {entry.endTime})
                        </span>
                      </div>
                      <div>
                        <div className="self-end rounded-md px-2 pt-1 text-s text-center">
                          {entry.subject}
                        </div>
                        <div className="self-start rounded-md px-2 pb-1 text-xs font-light text-center">
                          ({getTeacherName(entry.teacher)})
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
