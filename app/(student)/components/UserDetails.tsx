"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUsers , User } from "@/lib/users-context"
import { UserFormDialog } from "../../(admin)/components/user-form"
import { Mail, Phone, Calendar, Pencil, Trash2, Shield, Briefcase, User as UserIcon } from "lucide-react"

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
  admin: "bg-primary/10 text-primary border-primary/20",
  manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  agent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  viewer: "bg-muted text-muted-foreground border-border",
}

const agentTypeBadgeColors: Record<string, string> = {
  interne: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  externe: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  freelance: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
}

interface UserDetailsCardProps {
  user: User
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Header with photo and name */}
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-transparent px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={`${user.prenom} ${user.nom}`}
                  className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-3xl font-semibold text-primary shadow-lg">
                  {user.prenom[0]}{user.nom[0]}
                </div>
              )}
            </div>

            {/* Name and badges */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {user.prenom} {user.nom}
              </h1>
              <p className="mt-1 text-muted-foreground">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${roleBadgeColors[user.role]}`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  {roleLabels[user.role]}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${agentTypeBadgeColors[user.agentType]}`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  {agentTypeLabels[user.agentType]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          {/* Contact information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              Informations de contact
            </h3>
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">{user.telephone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Informations du compte
            </h3>
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Date de création</p>
                <p className="font-medium text-foreground">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dernière modification</p>
                <p className="font-medium text-foreground">{formatDate(user.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Identifiant</p>
                <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
