import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  titleWidthClassName?: string
  rows?: number
}

export default function AppPageSkeleton({ titleWidthClassName = "w-48", rows = 8 }: Props) {
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className={`h-8 ${titleWidthClassName}`} />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

