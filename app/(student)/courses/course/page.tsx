"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Star,
  CheckCircle2,
  BookOpen,
} from "lucide-react"
import { useState } from "react"

const course = {
  title: "Advanced Web Development with React & Next.js",
  subtitle: "Master modern frontend development from fundamentals to deployment",
  image: "/images/course-hero.jpg",
  price: 299,
  originalPrice: 499,
  rating: 4.9,
  reviewCount: 2847,
  enrolledStudents: 12500,
  date: "May 15 - July 20, 2026",
  duration: "10 weeks",
  location: "Online + In-person sessions in San Francisco",
  instructor: {
    name: "Dr. Sarah Chen",
    title: "Senior Software Engineer at Vercel",
    avatar: "SC",
  },
  description: `This comprehensive course will take you from React fundamentals to building production-ready applications with Next.js. You'll learn modern development practices, state management, API integration, and deployment strategies used by top tech companies.

Whether you're a beginner looking to start your frontend journey or an experienced developer wanting to level up your skills, this course provides hands-on projects and real-world examples that will transform the way you build web applications.`,
  highlights: [
    "Build 5 real-world projects from scratch",
    "Learn server-side rendering and static generation",
    "Master TypeScript with React",
    "Deploy applications to production",
    "Access to private Discord community",
    "Certificate of completion",
  ],
  schedule: [
    { week: "Week 1-2", topic: "React Fundamentals & JSX", hours: "8 hours" },
    { week: "Week 3-4", topic: "State Management & Hooks", hours: "10 hours" },
    { week: "Week 5-6", topic: "Next.js & Routing", hours: "12 hours" },
    { week: "Week 7-8", topic: "API Integration & Data Fetching", hours: "10 hours" },
    { week: "Week 9-10", topic: "Deployment & Best Practices", hours: "8 hours" },
  ],
}

export default function CoursePage() {
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 h-100 bg-linear-to-b from-primary/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
              {/* Course Image */}
              <div className="lg:col-span-3">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-xl">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                    Bestseller
                  </Badge>
                </div>
              </div>

              {/* Course Info Card */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      ${course.price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${course.originalPrice}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      40% OFF
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="size-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({course.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <CalendarDays className="size-5 text-primary" />
                      <span className="text-foreground">{course.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="size-5 text-primary" />
                      <span className="text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="size-5 text-primary" />
                      <span className="text-foreground">{course.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="size-5 text-primary" />
                      <span className="text-foreground">
                        {course.enrolledStudents.toLocaleString()} students enrolled
                      </span>
                    </div>
                  </div>

                  <Button className="mt-6 w-full" size="lg">
                    Enroll Now
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Description */}
              <div>
                <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {course.subtitle}
                </p>

                {/* Instructor */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {course.instructor.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {course.instructor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <BookOpen className="size-5 text-primary" />
                  About This Course
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                  {course.description.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-foreground">
                  What You&apos;ll Learn
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-foreground">
                  Course Schedule
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Timeline
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Topic
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {course.schedule.map((item, index) => (
                        <tr
                          key={index}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground">
                            {item.week}
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground">
                            {item.topic}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-muted-foreground">
                            {item.hours}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar - Sticky */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">
                    This course includes:
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <Clock className="size-4 text-primary" />
                      48 hours of video content
                    </li>
                    <li className="flex items-center gap-3">
                      <BookOpen className="size-4 text-primary" />
                      25 downloadable resources
                    </li>
                    <li className="flex items-center gap-3">
                      <Users className="size-4 text-primary" />
                      Access to community forum
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="size-4 text-primary" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
