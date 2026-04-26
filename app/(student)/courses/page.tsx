"use client"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardImage, type CourseItem } from "../components/CourseCard"
import AppPageSkeleton from "@/components/skeletons/AppPageSkeleton"


type ApiCourse = {
  id: string
  title: string
  description: string
  fileName?: string
  filePath?: string
  subject?: string
  targetGroup?: string
  semester?: string
  teacher?: {
    firstName?: string
    lastName?: string
  }
}

const COURSES_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/courses`
    : null) ?? "http://localhost:3002/courses"

function teacherName(course: ApiCourse) {
  return [course.teacher?.firstName, course.teacher?.lastName].filter(Boolean).join(" ") || "Unknown teacher"
}

export default function NewsPage() {
    const [courses, setCourses] = useState<CourseItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      let isMounted = true

      const fetchCourses = async () => {
        try {
          const token = localStorage.getItem("auth_token")
          const response = await fetch(COURSES_URL, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          })

          if (!response.ok) throw new Error(`Failed to load courses (${response.status})`)

          const data = (await response.json()) as ApiCourse[]
          if (!isMounted) return

          const mappedCourses: CourseItem[] = (Array.isArray(data) ? data : []).map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            subject: course.subject,
            targetGroup: course.targetGroup ?? "all",
            semester: course.semester,
            fileName: course.fileName,
            filePath: course.filePath,
            teacher: teacherName(course),
          }))

          setCourses(mappedCourses)
        } catch {
          if (!isMounted) return
          setError("Could not load courses right now.")
        } finally {
          if (isMounted) setLoading(false)
        }
      }

      fetchCourses()

      return () => {
        isMounted = false
      }
    }, [])

    return (
        <>
        {loading ? <AppPageSkeleton/> : 
        <div className="p-5">
            <header className="mb-8 flex items-center gap-4">
                <Link
                href="/student-dashboard"
                className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
                >
                <ArrowLeft className="size-5" />
                </Link>
                <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Courses</h1>
                </div>
            </header>

            {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading courses...</p> : null}
            {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}
            {!loading && !error && courses.length === 0 ? (
              <p className="mb-4 text-sm text-muted-foreground">No courses available.</p>
            ) : null}

            <div className="p-2 grid grid-cols-1 gap-3">
                {courses.map((course) => (
                  <CardImage key={course.id} course={course} />
                ))}
            </div>
        </div>
        }
        </>
    )
}