'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users, BookOpen, Clock, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Course {
  id: string;
  name: string;
  code: string;
  group: string;
  students: number;
  schedule: string;
}

interface Group {
  id: string;
  name: string;
  courseCount: number;
  studentCount: number;
}

interface ScheduleItem {
  id: string;
  time: string;
  course: string;
  group: string;
  room: string;
}

const courses: Course[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', group: 'Group A', students: 30, schedule: 'Mon, Wed, Fri 9:00 AM' },
  { id: '2', name: 'Physics', code: 'PHY101', group: 'Group B', students: 28, schedule: 'Tue, Thu 10:00 AM' },
  { id: '3', name: 'Chemistry', code: 'CHEM101', group: 'Group A', students: 32, schedule: 'Mon, Wed 2:00 PM' },
  { id: '4', name: 'Biology', code: 'BIO101', group: 'Group C', students: 29, schedule: 'Tue, Thu, Fri 11:00 AM' },
  { id: '5', name: 'Computer Science', code: 'CS101', group: 'Group B', students: 35, schedule: 'Mon, Wed, Fri 1:00 PM' },
];

const groups: Group[] = [
  { id: '1', name: 'Group A', courseCount: 2, studentCount: 62 },
  { id: '2', name: 'Group B', courseCount: 2, studentCount: 63 },
  { id: '3', name: 'Group C', courseCount: 1, studentCount: 29 },
];

const todaySchedule: ScheduleItem[] = [
  { id: '1', time: '9:00 AM - 10:00 AM', course: 'Mathematics', group: 'Group A', room: 'Room 101' },
  { id: '2', time: '10:00 AM - 11:00 AM', course: 'Physics', group: 'Group B', room: 'Lab 2' },
  { id: '3', time: '11:00 AM - 12:00 PM', course: 'Biology', group: 'Group C', room: 'Room 305' },
  { id: '4', time: '1:00 PM - 2:00 PM', course: 'Computer Science', group: 'Group B', room: 'Lab 1' },
  { id: '5', time: '2:00 PM - 3:00 PM', course: 'Chemistry', group: 'Group A', room: 'Lab 3' },
];

export default function ProfessorDashboard() {
  const [coursesToShow, setCoursesToShow] = useState(courses.slice(0, 5));

  return (
    <div className="min-h-screen bg-background p-5">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        {/* <Link
          href="/student-dashboard"
          className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link> */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Professor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your courses, groups, and schedule</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{courses.length}</span>
              <BookOpen className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{groups.length}</span>
              <Users className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{groups.reduce((sum, g) => sum + g.studentCount, 0)}</span>
              <Users className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <CardTitle>My Courses</CardTitle>
                </div>
                <Link href="/professor/courses/create">
                  <Button size="sm" gap="2">
                    <Plus className="size-4" />
                    Add Course
                  </Button>
                </Link>
              </div>
              <CardDescription>Courses assigned to your groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursesToShow.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{course.code}</TableCell>
                        <TableCell className="text-sm">{course.group}</TableCell>
                        <TableCell className="text-sm">{course.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/professor/courses/${course.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 className="size-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <Link href="/professor/courses">
                  <Button variant="outline" className="w-full">
                    View All Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Groups Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <CardTitle>My Groups</CardTitle>
              </div>
              <CardDescription>Groups with their students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">{group.studentCount} students • {group.courseCount} course(s)</p>
                    </div>
                    <Link href={`/professor/groups/${group.id}`}>
                      <Button variant="outline" size="sm">
                        View Students
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Today's Schedule */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <CardTitle>Today&apos;s Schedule</CardTitle>
            </div>
            <CardDescription>Monday, March 29, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs font-semibold text-primary mb-1">{item.time}</p>
                  <h4 className="font-medium text-foreground text-sm">{item.course}</h4>
                  <p className="text-xs text-muted-foreground">{item.group}</p>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
              ))}
            </div>
            <Link href="/professor/timetable" className="mt-4 block">
              <Button variant="outline" className="w-full">
                Full Timetable
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
