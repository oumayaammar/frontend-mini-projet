'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';

interface FormData {
  name: string;
  code: string;
  description: string;
  group: string;
  credits: string;
  schedule: string;
  room: string;
}

const groups = ['Group A', 'Group B', 'Group C'];

// Mock data - in real app would fetch based on params
const mockCourse: FormData = {
  name: 'Mathematics',
  code: 'MATH101',
  description: 'Introduction to calculus and advanced mathematics',
  group: 'Group A',
  credits: '3',
  schedule: 'Mon, Wed, Fri 9:00 AM',
  room: 'Room 101',
};

export default function EditCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(mockCourse);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating course:', formData);
    router.push('/professor/courses');
  };

  return (
    <div className="min-h-screen bg-background p-5">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <Link
          href="/professor/courses"
          className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Edit Course</h1>
          <p className="text-sm text-muted-foreground">Update course information</p>
        </div>
      </header>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Update the course details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="name">Course Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics"
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="code">Course Code</FieldLabel>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., MATH101"
                  required
                />
              </FieldGroup>
            </div>

            <FieldGroup>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Course description..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </FieldGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="group">Assigned Group</FieldLabel>
                <select
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {groups.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="credits">Credits</FieldLabel>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={handleChange}
                  placeholder="3"
                  required
                />
              </FieldGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="schedule">Schedule</FieldLabel>
                <Input
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  placeholder="e.g., Mon, Wed, Fri 9:00 AM"
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="room">Room Number</FieldLabel>
                <Input
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="e.g., Room 101"
                  required
                />
              </FieldGroup>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
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
  );
}
