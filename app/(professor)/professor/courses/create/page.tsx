'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { useCourses } from '@/lib/courses-context';


interface FormData {
  file: File | null;
  title: string;
  subject: string;
  targetGroup: string;
  semester: string;
}

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History'];
const targetGroups = ['Group A', 'Group A1', 'Group A2', 'Group B', 'Group B1', 'Group B2', 'Group C'];
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

export default function CreateCoursePage() {
  const router = useRouter();
  const { addCourse } = useCourses();
  const [formData, setFormData] = useState<FormData>({
    file: null,
    title: '',
    subject: subjects[0],
    targetGroup: targetGroups[0],
    semester: semesters[0],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCourse({
      title: formData.title,
      subject: formData.subject,
      targetGroup: formData.targetGroup,
      semester: formData.semester,
      fileName: formData.file?.name || null,
    });
    
    router.push('/professor/courses');
  };

  return (
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
                      {subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="targetGroup">Target Group</FieldLabel>
                    <select
                      id="targetGroup"
                      name="targetGroup"
                      value={formData.targetGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {targetGroups.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </FieldGroup>
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
  );
}
