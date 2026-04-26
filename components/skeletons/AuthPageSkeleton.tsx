import { Skeleton } from "@/components/ui/skeleton"

export default function AuthPageSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-64" />

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <Skeleton className="mt-4 h-4 w-56" />
      </section>
    </main>
  )
}

