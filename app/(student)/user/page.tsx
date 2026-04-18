"use client"

import { initialUsers } from "@/lib/users-context"
import { UserDetailsCard } from "../components/UserDetails"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UserDetailsPage() {

  const user = initialUsers[1];
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>
        <UserDetailsCard user={user} />
      </div>
    </div>
  )
}
