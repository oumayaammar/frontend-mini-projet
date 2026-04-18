import { UsersProvider } from "@/lib/users-context"
import { UsersTable } from "../components/user-table"
import { Users } from "lucide-react"

export default function UsersPage() {
  return (
    <UsersProvider>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestion des utilisateurs</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez les utilisateurs, leurs rôles et leurs informations
                </p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <UsersTable />
        </div>
      </div>
    </UsersProvider>
  )
}
