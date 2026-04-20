'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  subject: string;
  targetGroup: string;
  semester: string;
  fileName: string | null;
  createdAt: string;
}

interface CoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourse: (id: string) => Course | undefined;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const initialCourses: Course[] = [
  { 
    id: '1', 
    title: 'Introduction to Mathematics', 
    subject: 'Mathematics', 
    targetGroup: 'Group A', 
    semester: 'Semester 1',
    fileName: 'math_syllabus.pdf',
    createdAt: '2024-01-15'
  },
  { 
    id: '2', 
    title: 'Physics Fundamentals', 
    subject: 'Physics', 
    targetGroup: 'Group B', 
    semester: 'Semester 1',
    fileName: 'physics_intro.pdf',
    createdAt: '2024-01-20'
  },
  { 
    id: '3', 
    title: 'Organic Chemistry', 
    subject: 'Chemistry', 
    targetGroup: 'Group A', 
    semester: 'Semester 2',
    fileName: null,
    createdAt: '2024-02-01'
  },
  { 
    id: '4', 
    title: 'Cell Biology', 
    subject: 'Biology', 
    targetGroup: 'Group C', 
    semester: 'Semester 2',
    fileName: 'biology_cells.pdf',
    createdAt: '2024-02-10'
  },
  { 
    id: '5', 
    title: 'Programming Basics', 
    subject: 'Computer Science', 
    targetGroup: 'Group B', 
    semester: 'Semester 1',
    fileName: 'cs101_guide.pdf',
    createdAt: '2024-01-25'
  },
];

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === id ? { ...course, ...updatedFields } : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const getCourse = (id: string) => {
    return courses.find(course => course.id === id);
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, getCourse }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
}
