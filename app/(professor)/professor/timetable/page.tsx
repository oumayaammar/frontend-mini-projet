'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  course: string;
  courseCode: string;
  group: string;
  room: string;
  duration: string;
}

const timetable: TimetableEntry[] = [
  // Monday
  { id: '1', day: 'Monday', time: '9:00 AM', course: 'Mathematics', courseCode: 'MATH101', group: 'Group A', room: 'Room 101', duration: '1h' },
  { id: '2', day: 'Monday', time: '10:30 AM', course: 'Physics', courseCode: 'PHY101', group: 'Group B', room: 'Lab 2', duration: '1.5h' },
  { id: '3', day: 'Monday', time: '1:00 PM', course: 'Computer Science', courseCode: 'CS101', group: 'Group B', room: 'Lab 1', duration: '1h' },
  { id: '4', day: 'Monday', time: '2:00 PM', course: 'Chemistry', courseCode: 'CHEM101', group: 'Group A', room: 'Lab 3', duration: '1h' },
  
  // Tuesday
  { id: '5', day: 'Tuesday', time: '10:00 AM', course: 'Physics', courseCode: 'PHY101', group: 'Group B', room: 'Room 205', duration: '1h' },
  { id: '6', day: 'Tuesday', time: '11:00 AM', course: 'Biology', courseCode: 'BIO101', group: 'Group C', room: 'Room 305', duration: '1h' },
  { id: '7', day: 'Tuesday', time: '2:00 PM', course: 'Mathematics', courseCode: 'MATH101', group: 'Group A', room: 'Room 101', duration: '1h' },
  
  // Wednesday
  { id: '8', day: 'Wednesday', time: '9:00 AM', course: 'Mathematics', courseCode: 'MATH101', group: 'Group A', room: 'Room 101', duration: '1h' },
  { id: '9', day: 'Wednesday', time: '10:30 AM', course: 'Physics', courseCode: 'PHY101', group: 'Group B', room: 'Lab 2', duration: '1.5h' },
  { id: '10', day: 'Wednesday', time: '2:00 PM', course: 'Chemistry', courseCode: 'CHEM101', group: 'Group A', room: 'Lab 3', duration: '1h' },
  
  // Thursday
  { id: '11', day: 'Thursday', time: '10:00 AM', course: 'Physics', courseCode: 'PHY101', group: 'Group B', room: 'Room 205', duration: '1h' },
  { id: '12', day: 'Thursday', time: '11:00 AM', course: 'Biology', courseCode: 'BIO101', group: 'Group C', room: 'Room 305', duration: '1h' },
  
  // Friday
  { id: '13', day: 'Friday', time: '9:00 AM', course: 'Mathematics', courseCode: 'MATH101', group: 'Group A', room: 'Room 101', duration: '1h' },
  { id: '14', day: 'Friday', time: '11:00 AM', course: 'Biology', courseCode: 'BIO101', group: 'Group C', room: 'Room 305', duration: '1h' },
  { id: '15', day: 'Friday', time: '1:00 PM', course: 'Computer Science', courseCode: 'CS101', group: 'Group B', room: 'Lab 1', duration: '1h' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimetablePage() {
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
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Weekly Timetable</h1>
          <p className="text-sm text-muted-foreground">Your teaching schedule for the week</p>
        </div>
      </header>

      {/* Full Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Schedule</CardTitle>
          <CardDescription>All classes for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{entry.day}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{entry.time}</TableCell>
                    <TableCell className="font-medium">{entry.course}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.courseCode}</TableCell>
                    <TableCell className="text-sm">{entry.group}</TableCell>
                    <TableCell className="text-sm">{entry.room}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayClasses = timetable.filter(item => item.day === day);
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
                <CardDescription>{dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled</p>
                  ) : (
                    dayClasses.map((classItem) => (
                      <div key={classItem.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <p className="text-xs font-semibold text-primary mb-1">{classItem.time}</p>
                        <h4 className="font-medium text-foreground text-sm">{classItem.course}</h4>
                        <p className="text-xs text-muted-foreground">{classItem.courseCode}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="secondary" className="text-xs">{classItem.group}</Badge>
                          <span className="text-xs text-muted-foreground">{classItem.room}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
