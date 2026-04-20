'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { useCourses } from '@/lib/courses-context';


interface FormData {
  file: File | null;
  fileName: string | null;
  title: string;
  subject: string;
  targetGroup: string;
  semester: string;
}

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History'];
const targetGroups = ['Group A', 'Group A1', 'Group A2', 'Group B', 'Group B1', 'Group B2', 'Group C'];
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const { getCourse, updateCourse } = useCourses();
  const courseId = params.id as string;
  
  const [formData, setFormData] = useState<FormData>({
    file: null,
    fileName: null,
    title: '',
    subject: subjects[0],
    targetGroup: targetGroups[0],
    semester: semesters[0],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const course = getCourse(courseId);
    if (course) {
      setFormData({
        file: null,
        fileName: course.fileName,
        title: course.title,
        subject: course.subject,
        targetGroup: course.targetGroup,
        semester: course.semester,
      });
      setIsLoading(false);
    } else {
      setNotFound(true);
      setIsLoading(false);
    }
  }, [courseId, getCourse]);

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
      fileName: file?.name || null,
    }));
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      fileName: null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateCourse(courseId, {
      title: formData.title,
      subject: formData.subject,
      targetGroup: formData.targetGroup,
      semester: formData.semester,
      fileName: formData.file?.name || formData.fileName,
    });
    
    router.push('/professor/courses');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Course not found</p>
          <Link href="/professor/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                {/* File Upload */}
                <FieldGroup>
                  <FieldLabel htmlFor="file">Course File</FieldLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {formData.fileName ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-medium text-foreground">{formData.fileName}</span>
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
      </div>
    </div>
  );
}
