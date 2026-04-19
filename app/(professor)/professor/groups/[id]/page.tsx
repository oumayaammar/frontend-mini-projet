'use client';

import Link from 'next/link';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive';
}

interface GroupData {
  id: string;
  name: string;
  courseCount: number;
  studentCount: number;
  students: Student[];
}

// Mock data
const groupData: GroupData = {
  id: '1',
  name: 'Group A',
  courseCount: 2,
  studentCount: 62,
  students: [
    { id: '1', name: 'Ahmed Hassan', email: 'ahmed@example.com', enrollmentDate: 'Jan 15, 2024', status: 'Active' },
    { id: '2', name: 'Fatima Mohamed', email: 'fatima@example.com', enrollmentDate: 'Jan 15, 2024', status: 'Active' },
    { id: '3', name: 'Karim Khan', email: 'karim@example.com', enrollmentDate: 'Feb 01, 2024', status: 'Active' },
    { id: '4', name: 'Layla Abu', email: 'layla@example.com', enrollmentDate: 'Jan 20, 2024', status: 'Active' },
    { id: '5', name: 'Omar Ali', email: 'omar@example.com', enrollmentDate: 'Jan 15, 2024', status: 'Active' },
    { id: '6', name: 'Noor Saleh', email: 'noor@example.com', enrollmentDate: 'Feb 05, 2024', status: 'Inactive' },
  ],
};

export default function GroupStudentsPage() {
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
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{groupData.name}</h1>
          <p className="text-sm text-muted-foreground">View and manage students in this group</p>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{groupData.studentCount}</span>
              <Users className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{groupData.courseCount}</span>
              <BookOpen className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>All students enrolled in {groupData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupData.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-sm">{student.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{student.enrollmentDate}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Courses */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Assigned Courses</CardTitle>
          <CardDescription>Courses assigned to {groupData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <h4 className="font-semibold text-foreground">Mathematics (MATH101)</h4>
              <p className="text-sm text-muted-foreground mt-1">Mon, Wed, Fri 9:00 AM • Room 101 • 3 Credits</p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <h4 className="font-semibold text-foreground">Chemistry (CHEM101)</h4>
              <p className="text-sm text-muted-foreground mt-1">Mon, Wed 2:00 PM • Lab 3 • 3 Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
