'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Course {
  id: string;
  name: string;
  code: string;
  group: string;
  students: number;
  schedule: string;
  credits: number;
}

const initialCourses: Course[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', group: 'Group A', students: 30, schedule: 'Mon, Wed, Fri 9:00 AM', credits: 3 },
  { id: '2', name: 'Physics', code: 'PHY101', group: 'Group B', students: 28, schedule: 'Tue, Thu 10:00 AM', credits: 4 },
  { id: '3', name: 'Chemistry', code: 'CHEM101', group: 'Group A', students: 32, schedule: 'Mon, Wed 2:00 PM', credits: 3 },
  { id: '4', name: 'Biology', code: 'BIO101', group: 'Group C', students: 29, schedule: 'Tue, Thu, Fri 11:00 AM', credits: 3 },
  { id: '5', name: 'Computer Science', code: 'CS101', group: 'Group B', students: 35, schedule: 'Mon, Wed, Fri 1:00 PM', credits: 4 },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background p-5">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <Link
          href="/professor-dashboard"
          className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Courses</h1>
          <p className="text-sm text-muted-foreground">Manage all your courses</p>
        </div>
        <Link href="/professor/courses/create">
          <Button gap="2">
            <Plus className="size-4" />
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
              placeholder="Search by course name or code..."
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
              <Link href="/professor/courses/create">
                <Button>Create First Course</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{course.code}</TableCell>
                      <TableCell className="text-sm">{course.group}</TableCell>
                      <TableCell className="text-sm">{course.students}</TableCell>
                      <TableCell className="text-sm">{course.credits}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{course.schedule}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/professor/courses/${course.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="size-4" />
                            </Button>
                          </Link>
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
  );
}
