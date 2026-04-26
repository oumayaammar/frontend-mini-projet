"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Select } from "react-day-picker"
import AppPageSkeleton from "@/components/skeletons/AppPageSkeleton"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const SCHEDULE_URL = `${API_BASE}/schedule`
const USERS_URL = `${API_BASE}/users`

type TeacherOption = {
  id: string
  name: string
}

export default function NewSchedulePage() {

  const params = useParams();
  const initialTargetId = params?.id ?? "No target selected";

  const [subject, setSubject] = useState("")
  const [room, setRoom] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("1")
  const [startTime, setStartTime] = useState("8:30")
  const [endTime, setEndTime] = useState("10:00")
  const [semester, setSemester] = useState("S1")
  const [type, setType] = useState("C")
  const [studentGroup, setStudentGroup] = useState(initialTargetId)
  const [teacherId, setTeacherId] = useState("")
  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const helperText = "Create a schedule entry for a specific student group."

  useEffect(() => {
    let isMounted = true

    async function loadTeachers() {
      setLoadingTeachers(true)
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(USERS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error(`Failed to load teachers (${response.status})`)
        }

        const payload = (await response.json()) as unknown
        const users = Array.isArray(payload)
          ? payload
          : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown[] }).data)
            ? ((payload as { data: unknown[] }).data ?? [])
            : []

        const teachers = users
          .filter((item) => {
            if (!item || typeof item !== "object") return false
            const row = item as Record<string, unknown>
            const role = String(row.role ?? row.userRole ?? "").toLowerCase()
            return role === "teacher"
          })
          .map((item, index) => {
            const row = item as Record<string, unknown>
            const id = String(row.id ?? row._id ?? row.teacherId ?? `teacher-${index}`)
            const fullName = [row.firstName, row.lastName]
              .filter((part) => typeof part === "string" && part.length > 0)
              .join(" ")

            return {
              id,
              name: String(fullName || row.name || row.username || row.email || id),
            }
          })

        if (!isMounted) return
        setTeacherOptions(teachers)
      } catch {
        if (!isMounted) return
        setTeacherOptions([])
      } finally {
        if (isMounted) setLoadingTeachers(false)
      }
    }

    void loadTeachers()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const payload = {
      subject,
      room,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      studentGroup,
      semester,
      type,
      teacherId,
    }

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(SCHEDULE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const text = await response.text()
      let data: unknown = null
      if (text) {
        try {
          data = JSON.parse(text) as unknown
        } catch {
          data = text
        }
      }

      if (!response.ok) {
        if (data && typeof data === "object" && "message" in data) {
          throw new Error(String((data as { message: unknown }).message))
        }
        throw new Error(`Could not create schedule (${response.status})`)
      }

      setSuccess("Schedule created successfully.")
      setSubject("")
      setRoom("")
      setDayOfWeek("1")
      setStartTime("")
      setEndTime("")
      setSemester("S1")
      setType("C")
      setTeacherId("")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create schedule.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {loading || loadingTeachers ? <AppPageSkeleton/> : 
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/timeTablesManagement"
            className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Add New Schedule</h1>
            <p className="text-sm text-muted-foreground">{helperText}</p>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            className={"rounded-xl border p-4 text-left transition border-border bg-card hover:bg-secondary/50"
            }
          >
            <p className="font-semibold">For a Group</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-border bg-card p-5">
          {error ? <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="rounded bg-green-500/10 px-3 py-2 text-sm text-green-700">{success}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Subject
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="Base de donnees relationnelle"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Room
              <input
                required
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="K12"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">
              Day
              <select
                value={dayOfWeek}
                onChange={(event) => setDayOfWeek(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Start time
              <Select
                required
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="8:30">8:30</option>
                <option value="10:10">10:10</option>
                <option value="11:50">11:50</option>
                <option value="13:30">13:30</option>
                <option value="13:50">13:50</option>
                <option value="15:30">15:30</option>
                <option value="17:10">17:10</option>
              </Select>
            </label>

            <label className="grid gap-1 text-sm">
              End time
              <Select
                required
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="10:00">10:00</option>
                <option value="11:40">11:40</option>
                <option value="13:20">13:20</option>
                <option value="15:00">15:00</option>
                <option value="15:20">15:20</option>
                <option value="17:00">17:00</option>
                <option value="18:40">18:40</option>
              </Select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Semester
              <Select
                required
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="S1">Semestre 1</option>
                <option value="S2">Semestre 2</option>
              </Select>
            </label>

            <label className="grid gap-1 text-sm">
              Type
              <Select
                required
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="C">Cours</option>
                <option value="TD">Traveaux Dérigées</option>
                <option value="TP">Traveaux Pratiques</option>

              </Select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Student group
              <input
                required
                value={studentGroup}
                readOnly
                onChange={(event) => setStudentGroup(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="ING_A1_G1"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Teacher
              <select
                required
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="">
                  {loadingTeachers
                    ? "Loading teachers..."
                    : teacherOptions.length > 0
                      ? "Select teacher"
                      : "No teachers found"}
                </option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create schedule"}
          </button>
        </form>
      </div>
    </div>
    }
    </>
  )
}
