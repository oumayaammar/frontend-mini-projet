'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Clock, MessageSquare, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Types
interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  color: string;
}

interface Message {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

interface ScheduleItem {
  id: string;
  subject: string;
  instructor: string;
  time: string;
  room: string;
  day: string;
}

// Sample Data
const latestNews: NewsItem[] = [
  {
    id: '1',
    title: 'Répartition des groupes',
    description: 'Distribution of student groups announcement',
    date: '(29/03/2026)',
    category: 'General',
    image: '/news-1.jpg'
  },
  {
    id: '2',
    title: 'New Campus Facilities Opened',
    description: 'State-of-the-art learning center available',
    date: 'March 15, 2024',
    category: 'Campus News',
    image: '/news-2.jpg'
  },
  {
    id: '3',
    title: 'Scholarship Applications Now Open',
    description: 'Apply now for merit-based scholarships',
    date: 'March 10, 2024',
    category: 'Scholarships',
    image: '/news-3.jpg'
  }
];

const courses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. John Smith',
    progress: 75,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Mathematics - Calculus II',
    instructor: 'Prof. Sarah Wilson',
    progress: 60,
    color: 'bg-purple-500'
  },
  {
    id: '3',
    name: 'English Literature',
    instructor: 'Dr. Emma Johnson',
    progress: 85,
    color: 'bg-green-500'
  },
  {
    id: '4',
    name: 'Physics - Mechanics',
    instructor: 'Prof. Michael Chen',
    progress: 70,
    color: 'bg-orange-500'
  }
];

const recentMessages: Message[] = [
  {
    id: '1',
    name: 'Creative Director',
    lastMessage: 'Great work on the slides! Love it!',
    timestamp: '13:53',
    unread: 0
  },
  {
    id: '2',
    name: 'Sarah Chen',
    lastMessage: 'The new designs look amazing!',
    timestamp: '12:30',
    unread: 2
  },
  {
    id: '3',
    name: 'Design Team',
    lastMessage: 'Can we review the mockups?',
    timestamp: '11:15',
    unread: 0
  }
];

const todaySchedule: ScheduleItem[] = [
  {
    id: '1',
    subject: 'Introduction to Computer Science',
    instructor: 'Dr. John Smith',
    time: '09:00 - 10:30',
    room: 'Room 101',
    day: 'Monday'
  },
  {
    id: '2',
    subject: 'Mathematics - Calculus II',
    instructor: 'Prof. Sarah Wilson',
    time: '11:00 - 12:30',
    room: 'Room 205',
    day: 'Monday'
  },
  {
    id: '3',
    subject: 'English Literature',
    instructor: 'Dr. Emma Johnson',
    time: '14:00 - 15:30',
    room: 'Room 310',
    day: 'Monday'
  },
  {
    id: '4',
    subject: 'Physics - Mechanics',
    instructor: 'Prof. Michael Chen',
    time: '16:00 - 17:30',
    room: 'Lab 5',
    day: 'Monday'
  }
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back, Student</h1>
        <p className="text-muted-foreground">Here&apos;s your dashboard overview</p>
      </div>

      {/* Timetable - Top Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <CardTitle>Today&apos;s Timetable</CardTitle>
          </div>
          <CardDescription>Monday, March 29, 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaySchedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-sm">{item.time}</TableCell>
                    <TableCell className="text-sm">{item.subject}</TableCell>
                    <TableCell className="text-sm">{item.instructor}</TableCell>
                    <TableCell className="text-sm">{item.room}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - News and Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest News */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="size-5 text-primary" />
                  <CardTitle>Latest News</CardTitle>
                </div>
                <Link href="/news">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Stay updated with the latest announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestNews.map((news) => (
                  <Link key={news.id} href="/news" className="block">
                    <div className="p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        {news.image && (
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-16 h-16 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {news.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                            {news.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                            <span>{news.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <CardTitle>My Courses</CardTitle>
                </div>
                <Link href="/courses">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Your enrolled courses and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{course.name}</h4>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Messages */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  <CardTitle>Messages</CardTitle>
                </div>
                <Link href="/messages">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Recent conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <Link key={message.id} href="/messages" className="block">
                    <div className="p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                          {message.name}
                        </h4>
                        {message.unread > 0 && (
                          <Badge variant="default" className="text-xs px-1.5 h-5 flex items-center">
                            {message.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                        {message.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent> 
          </Card>
        </div>
      </div>
    </div>
  );
}
