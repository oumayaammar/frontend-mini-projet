import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type CourseItem = {
  id: string
  title: string
  description: string
  subject?: string
  targetGroup?: string
  semester?: string
  fileName?: string
  filePath?: string
  teacher?: string
}

interface CardImageProps {
  course: CourseItem
}

export function CardImage({ course }: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full p-5">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{course.subject || "Course"}</Badge>
        </CardAction>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>
          {course.description}
        </CardDescription>
        <CardDescription>
          {course.teacher || "Unknown teacher"}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {course.filePath ? (
          <Button asChild className="w-full">
            <a href={course.filePath} download={course.fileName || true} target="_blank" rel="noreferrer">
              File Download
            </a>
          </Button>
        ) : (
          <Button className="w-full" disabled>
            File Download
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
