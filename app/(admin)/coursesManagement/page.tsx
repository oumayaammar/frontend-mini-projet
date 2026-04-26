'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Search, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppPageSkeleton from '@/components/skeletons/AppPageSkeleton';

type ApiCourse = {
  id: string
  title: string
  description: string
  fileName?: string
  filePath?: string
  subject?: string
  targetGroup?: string
  semester?: string
  uploadedAt: string
}

type CourseItem = {
  id: string
  title: string
  description: string
  subject?: string
  targetGroup?: string
  semester?: string
  fileName?: string
  filePath?: string
  uploadedAt: string
}

const COURSES_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/courses`
    : null) ?? "http://localhost:3002/courses"


export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
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

        console.log(data)
        const mappedCourses: CourseItem[] = (Array.isArray(data) ? data : []).map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          subject: course.subject,
          targetGroup: course.targetGroup ?? "all",
          semester: course.semester,
          fileName: course.fileName,
          filePath: course.filePath,
          uploadedAt: course.uploadedAt,
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

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.targetGroup?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${COURSES_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) throw new Error(`Failed to delete course (${response.status})`)
      setCourses((prev) => prev.filter((course) => course.id !== id))
    } catch {
      setError("Could not delete the course right now.")
    }
  };

  return (
    <>
    {loading ? <AppPageSkeleton/> : 
    <div className="flex flex-col h-screen bg-background">
      <div className="overflow-y-auto flex-1">
        <div className="p-5">
          {/* Header */}
          <header className="mb-8 flex items-center gap-4">
            <Link
              href="/admin-dashboard"
              className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Courses</h1>
              <p className="text-sm text-muted-foreground">Manage all your courses</p>
            </div>
            <Link href="/coursesManagement/create">
              <Button>
                <Plus className="size-4 mr-2" />
                Add New Course
              </Button>
            </Link>
          </header>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, subject or group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Courses Table */}
          <Card>
            <CardContent className="pt-6">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No courses found</p>
                  <Link href="/coursesManagement/create">
                    <Button>Create First Course</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Target Group</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell className="text-sm">{course.subject}</TableCell>
                          <TableCell className="text-sm">{course.targetGroup}</TableCell>
                          <TableCell className="text-sm">{course.semester}</TableCell>
                          <TableCell className="text-sm">
                            {course.fileName ? (
                              <div className="flex items-center gap-1 text-primary">
                                <FileText className="size-4"/>
                                <span className="truncate max-w-30">{course.fileName}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No file</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(course.uploadedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2"> 
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(course.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    }
    </>
  );
}
