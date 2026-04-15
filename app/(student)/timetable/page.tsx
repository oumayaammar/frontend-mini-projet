"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const timetableData = [
  {
    day: "Monday",
    periods: ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "Biology"],
  },
  {
    day: "Tuesday",
    periods: ["English", "Mathematics", "Biology", "Physics", "Chemistry", "Computer Science"],
  },
  {
    day: "Wednesday",
    periods: ["Physics", "Chemistry", "Mathematics", "Computer Science", "English", "Biology"],
  },
  {
    day: "Thursday",
    periods: ["Chemistry", "Biology", "English", "Mathematics", "Physics", "Computer Science"],
  },
  {
    day: "Friday",
    periods: ["Computer Science", "English", "Physics", "Biology", "Mathematics", "Chemistry"],
  },
  {
    day: "Saturday",
    periods: ["Mathematics", "Physics", "Chemistry", "English"],
  },
]

const periodTimes = [
  "8:30 - 10:00",
  "10:10 - 11:40",
  "11:50 - 13:20",
  "13:50 - 15:20",
  "15:30 - 17:00",
  "17:10 - 18:40",
]

export default function TimetablePage() {
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

        {/* Mobile Card View */}
        <div className="flex flex-col gap-4">
          {timetableData.map((row) => (
            <div key={row.day} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border bg-secondary/50 px-4 py-3">
                <h3 className="font-semibold text-foreground">{row.day}</h3>
              </div>
              <div className="grid gap-2 p-3">
                {row.periods.map((subject, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between gap-5 rounded-lg bg-secondary/30 p-3 border-b-2"
                  >
                    <div className="flex flex-col text-center">    
                        <span className="text-s font-medium text-foreground">
                        S{index + 1}
                        </span>
                        
                        <span className="text-xs font-medium text-muted-foreground">
                    ({periodTimes[index]})
                        </span>
                    </div>
                    <div>
                        <div
                        className="self-end rounded-md px-2 pt-1 text-s text-center"
                        >
                        {subject}
                        </div>
                        <div
                        className="self-start rounded-md px-2 pb-1 text-xs font-light text-center"
                        >
                        (mohamed amine lazreg)
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <div className="self-center rounded-md px-2 pb-1 text-xs font-medium">
                            K10
                        </div>
                        <div className="self-center rounded-md px-2 pb-1 text-xs font-medium">
                            H
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
