"use client"

import { useState, useEffect, useRef } from "react"
import { useUsers , User, UserRole, AgentType } from "@/lib/users-context"
import { X, Upload, User as UserIcon } from "lucide-react"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "agent", label: "Agent" },
  { value: "viewer", label: "Lecteur" },
]

const agentTypes: { value: AgentType; label: string }[] = [
  { value: "interne", label: "Interne" },
  { value: "externe", label: "Externe" },
  { value: "freelance", label: "Freelance" },
]

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { addUser, updateUser } = useUsers()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!user

  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    role: "agent" as UserRole,
    agentType: "interne" as AgentType,
    telephone: "",
    photo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          agentType: user.agentType,
          telephone: user.telephone,
          photo: user.photo || "",
        })
      } else {
        setFormData({
          email: "",
          nom: "",
          prenom: "",
          role: "agent",
          agentType: "interne",
          telephone: "",
          photo: "",
        })
      }
      setErrors({})
    }
  }, [open, user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis"
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (isEditing && user) {
        updateUser({
          id: user.id,
          ...formData,
        })
      } else {
        addUser(formData)
      }
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                {formData.photo ? (
                  <img src={formData.photo} alt="Photo" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                Changer la photo
              </button>
              {formData.photo && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {/* Name fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium text-foreground">
                Prénom
              </label>
              <input
                id="prenom"
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData((prev) => ({ ...prev, prenom: e.target.value }))}
                className={`h-10 w-full rounded-lg border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.prenom ? "border-destructive" : "border-input"
                }`}
                placeholder="Jean"
              />
              {errors.prenom && <p className="text-xs text-destructive">{errors.prenom}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium text-foreground">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
                className={`h-10 w-full rounded-lg border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.nom ? "border-destructive" : "border-input"
                }`}
                placeholder="Dupont"
              />
              {errors.nom && <p className="text-xs text-destructive">{errors.nom}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.email ? "border-destructive" : "border-input"
              }`}
              placeholder="jean.dupont@example.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Telephone */}
          <div className="space-y-2">
            <label htmlFor="telephone" className="text-sm font-medium text-foreground">
              Téléphone
            </label>
            <input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.telephone ? "border-destructive" : "border-input"
              }`}
              placeholder="+33 6 12 34 56 78"
            />
            {errors.telephone && <p className="text-xs text-destructive">{errors.telephone}</p>}
          </div>

          {/* Role & Agent Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-foreground">
                Rôle
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="agentType" className="text-sm font-medium text-foreground">
                Type d&apos;agent
              </label>
              <select
                id="agentType"
                value={formData.agentType}
                onChange={(e) => setFormData((prev) => ({ ...prev, agentType: e.target.value as AgentType }))}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {agentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
