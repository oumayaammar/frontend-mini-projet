"use client"

import { useState } from "react"
import { useUsers , User } from "@/lib/users-context"
import { UserFormDialog } from "./user-form"
import { DeleteUserDialog } from "./delete-user"
import { Pencil, Trash2, Search, UserPlus } from "lucide-react"

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  manager: "Manager",
  agent: "Agent",
  viewer: "Lecteur",
}

const agentTypeLabels: Record<string, string> = {
  interne: "Interne",
  externe: "Externe",
  freelance: "Freelance",
}

const roleBadgeColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  manager: "bg-blue-500/10 text-blue-600",
  agent: "bg-emerald-500/10 text-emerald-600",
  viewer: "bg-muted text-muted-foreground",
}

export function UsersTable() {
  const { users } = useUsers()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.nom.toLowerCase().includes(query) ||
      user.prenom.toLowerCase().includes(query) ||
      user.telephone.includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Type d&apos;agent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Téléphone
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={`${user.prenom} ${user.nom}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            `${user.prenom[0]}${user.nom[0]}`
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.prenom} {user.nom}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColors[user.role]}`}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {agentTypeLabels[user.agentType]}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.telephone}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""}{" "}
          {searchQuery && `sur ${users.length}`}
        </p>
      </div>

      {/* Dialogs */}
      <UserFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <UserFormDialog open={!!editingUser} onOpenChange={() => setEditingUser(null)} user={editingUser} />
      <DeleteUserDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)} user={deletingUser} />
    </div>
  )
}
