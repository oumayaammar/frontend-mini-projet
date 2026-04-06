import { Button } from '@/components/ui/button'
import { CardImage } from '@/components/ui/CardImage'
import React from 'react'

const CoursesManagementPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
        
        <div className="flex flex-row justify-between p-4 w-full align-middle">
            <div className="flex flex-col justify-center p-4 w-full">
                <h1 className="text-2xl font-bold w-fit">Courses Management</h1>
                <p className="text-sm text-gray-500 w-fit">Here you can manage the courses</p>
            </div>
            <div>
                <Button>Add Course</Button>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full p-4">
            <h2 className="text-xl font-bold">Courses List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
                <CardImage />
            </div>
        </div>
    </main>
  )
}

export default CoursesManagementPage