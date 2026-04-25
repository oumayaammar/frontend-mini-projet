'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Clock, MessageSquare, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardSmall, type NewsItem } from '../components/newsCard';
import { CourseItem } from '../components/CourseCard';

//News
type ApiNews = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  isPinned: boolean;
  targetGroup?: string | null;
  createdAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
};

const NEWS_URL = (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/news` : null) ?? 'http://localhost:3002/news';

function formatAuthor(news: ApiNews) {
  const authorName = [news.author?.firstName, news.author?.lastName].filter(Boolean).join(' ');
  return authorName || 'Unknown author';
}

//Courses
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

//Time Table

type Teacher = {
  firstName?: string
  lastName?: string
}

type ScheduleItem = {
  id: string
  subject: string
  room: string
  dayOfWeek: number
  startTime: string
  endTime: string
  type: string
  teacher?: Teacher
}

type DaySchedule = {
  day: string
  entries: ScheduleItem[]
}

const SCHEDULE_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/schedule`
    : null) ?? "http://localhost:3002/schedule"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number(value))
  return hours * 60 + minutes
}

function getTeacherName(teacher?: Teacher) {
  const fullName = [teacher?.firstName, teacher?.lastName].filter(Boolean).join(" ")
  return fullName || "No teacher"
}


// Types
interface Message {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

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



export default function StudentDashboard() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const groupedSchedule = useMemo<DaySchedule[]>(() => {
    const grouped = new Map<string, ScheduleItem[]>()
    const dayNumber = new Date().getDay();

    for (const entry of schedule) {
      const day = DAYS[entry.dayOfWeek] ?? `Day ${entry.dayOfWeek}`
      if (!grouped.has(day)) grouped.set(day, [])
      grouped.get(day)?.push(entry)
    }

    return Array.from(grouped.entries())
      .filter((a) => DAYS.indexOf(a[0]) === dayNumber )
      .map(([day, entries]) => ({
        day,
        entries: entries.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)),
      }))
  }, [schedule])
  const todaysEntries = groupedSchedule[0]?.entries ?? []
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  )

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

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(NEWS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          throw new Error(`Failed to load news (${response.status})`);
        }

        const data = (await response.json()) as ApiNews[];
        if (!isMounted) return;

        const mappedNews: NewsItem[] = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          date: new Date(item.createdAt).toLocaleDateString(),
          author: formatAuthor(item),
          category: item.targetGroup ?? 'General',
          image: item.imageUrl ?? undefined,
          isPinned: item.isPinned,
        }));

        setNewsItems(mappedNews);
      } catch {
        if (!isMounted) return;
        setError('Could not load news right now.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedNewsItems = useMemo(
    () => [...newsItems].filter((b) => b.isPinned),
    [newsItems]
  );

  const selectedNews = newsItems.find(n => n.id === selectedNewsId);

  const handleDetailsClick = (news: NewsItem) => {
    setSelectedNewsId(news.id);
  };

  const handleBackClick = () => {
    setSelectedNewsId(null);
  };
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
          <CardDescription>{todayLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Starting Time</TableHead>
                  <TableHead>Ending Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysEntries.length > 0 ? (
                  todaysEntries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-sm">{item.startTime}</TableCell>
                      <TableCell className="font-medium text-sm">{item.endTime}</TableCell>
                      <TableCell className="text-sm">{item.subject}</TableCell>
                      <TableCell className="text-sm">{getTeacherName(item.teacher)}</TableCell>
                      <TableCell className="text-sm">{item.room}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-muted-foreground text-center">
                      No classes scheduled for today.
                    </TableCell>
                  </TableRow>
                )}
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
                {sortedNewsItems.map((news) => (
                  <Link key={news.id} href="/news" className="block">
                    <div className="p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        {news.image && (
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-16 h-16 rounded object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {news.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                    <div className="flex flex-row items-start justify-between w-full gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">{course.teacher}</p>
                      </div>
                      <Link href={course.filePath??"#"}>
                      <Button>View Course Details</Button>
                      </Link>
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
                        {/* {message.unread > 0 && (
                          <Badge variant="default" className="text-xs px-1.5 h-5 flex items-center">
                            {message.unread}
                          </Badge>
                        )} */}
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
