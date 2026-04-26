'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import AppPageSkeleton from '@/components/skeletons/AppPageSkeleton';


interface FormData {
  file: File | null;
  title: string;
  subject: string;
  targetGroup: string;
  semester: string;
}

type ScheduleItem = {
  id: string
  subject: string
}

// type DaySchedule = {
//   day: string
//   entries: ScheduleItem[]
// }

const semesters = ['S1', 'S2'];
const API_BASE =
(process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const GROUPS_URL = `${API_BASE}/users/groups`
const SCHEDULE_URL = `${API_BASE}/schedule`
const COURSES_UPLOAD_URL = `${API_BASE}/courses/upload`

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    file: null,
    title: '',
    subject: "No subject selected",
    targetGroup: "No target group selected",
    semester: "No semester selected",
  });
  const [subject, setSubject] = useState("")
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [studentGroup, setStudentGroup] = useState("")
  const [groupOptions, setGroupOptions] = useState<String[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadGroups() {
      setLoadingGroups(true)
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(GROUPS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error(`Failed to load teachers (${response.status})`)
        }

        const payload = (await response.json()) as unknown
        const groups = Array.isArray(payload)
          ? payload
          : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown[] }).data)
            ? ((payload as { data: unknown[] }).data ?? [])
            : []

        if (!isMounted) return
        setGroupOptions(groups)
      } catch {
        if (!isMounted) return
        setGroupOptions([])
      } finally {
        if (isMounted) setLoadingGroups(false)
      }
    }

    void loadGroups()

    return () => {
      isMounted = false
    }
  }, [])



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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file,
    }));
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const token = localStorage.getItem("auth_token")
      const payload = new FormData()
      payload.append("title", formData.title)
      payload.append("subject", formData.subject)
      payload.append("targetGroup", formData.targetGroup)
      payload.append("semester", formData.semester)
      if (formData.file) payload.append("file", formData.file)

      const response = await fetch(COURSES_UPLOAD_URL, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: payload,
      })

      if (!response.ok) {
        throw new Error(`Failed to create course (${response.status})`)
      }

      router.push('/professor/courses')
    } catch {
      setError("Could not create the course right now.")
    }
  }

  return (
    <>
    {loading ? <AppPageSkeleton/> : 
    <div className="flex flex-col h-screen bg-background">
      <div className="overflow-y-auto flex-1">
        <div className="p-5">
          {/* Header */}
          <header className="mb-8 flex items-center gap-4">
            <Link
              href="/professor/courses"
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Create New Course</h1>
              <p className="text-sm text-muted-foreground">Add a new course with file upload</p>
            </div>
          </header>

          {/* Form Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Fill in the course details and upload a file</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <FieldGroup>
                  <FieldLabel htmlFor="file">Course File</FieldLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {formData.file ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-medium text-foreground">{formData.file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="size-6 p-0"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                        <input
                          id="file"
                          name="file"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <div className="text-sm font-medium text-foreground">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX, or other document formats
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </FieldGroup>

                {/* Title */}
                <FieldGroup>
                  <FieldLabel htmlFor="title">Course Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Mathematics"
                    required
                  />
                </FieldGroup>

                {/* Subject and Target Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldGroup>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {schedule.map(s => (
                        <option key={s.id} value={s.subject}>{s.subject}</option>
                      ))}
                    </select>
                  </FieldGroup>

                  <label className="grid gap-1 text-sm">
                    Students Group
                    <select
                      required
                      value={studentGroup}
                      onChange={(event) => setStudentGroup(event.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2"
                    >
                      <option value="">
                        {loadingGroups
                          ? "Loading Groups..."
                          : groupOptions.length > 0
                            ? "Select Group"
                            : "No groups found"}
                      </option>
                      {groupOptions.map((group) => (
                        <option key={String(group)} value={String(group)}>
                          {String(group)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Semester */}
                <FieldGroup>
                  <FieldLabel htmlFor="semester">Semester</FieldLabel>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Course
                  </Button>
                  <Link href="/professor/courses" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    }
    </>
  );
}
