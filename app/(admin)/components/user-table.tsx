"use client"

import { useEffect, useState } from "react"
import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react"

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  teacher: "Enseignant",
  student: "Etudiant",
  parent: "Parent",
  manager: "Manager",
  agent: "Agent",
  viewer: "Lecteur",
}

const agentTypeLabels: Record<string, string> = {
  "": "-",
  interne: "Interne",
  externe: "Externe",
  freelance: "Freelance",
}

const roleBadgeColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  teacher: "bg-violet-500/10 text-violet-600",
  student: "bg-amber-500/10 text-amber-600",
  parent: "bg-cyan-500/10 text-cyan-600",
  manager: "bg-blue-500/10 text-blue-600",
  agent: "bg-emerald-500/10 text-emerald-600",
  viewer: "bg-muted text-muted-foreground",
}

type User = {
  id: string
  password: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  agentType: string
  studentGroup: string
  department: string
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002")

const USERS_URL = `${API_BASE}/users`
const GROUPS_URL = `${API_BASE}/users/groups`

const DEPARTMENTS = [
  "informatique",
  "EEA",
  "LISI",
  "LSI",
  "Mecanique",
  "Energétique",
  "electronique",
  "Génie Civile",
] as const

const AGENT_TYPES = [
  { value: "agent_sup", label: "Agent sup" },
  { value: "agent_administartif", label: "Agent administratif" },
  { value: "technicien", label: "Technicien" },
  { value: "resp_biblio", label: "Resp. bibliothèque" },
] as const

type UserFormData = {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  role: string
  agentType: string
  studentGroup: string
  department: string
}

type GroupOption = {
  value: string
  label: string
}

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    for (const key of ["data", "items", "results", "users"]) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

function normalizeUsers(payload: unknown): User[] {
  return asArray(payload)
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((row) => ({
      id: String(row.id ?? row._id ?? ""),
      password:String(row.password ?? row.password ?? ""),
      username: String(row.username ?? ""),
      firstName: String(row.firstName ?? ""),
      lastName: String(row.lastName ?? ""),
      email: String(row.email ?? ""),
      role: String(row.role ?? ""),
      agentType: String(row.agentType ?? ""),
      studentGroup: String(row.studentGroup ?? ""),
      department: String(row.department ?? ""),
    }))
}

function toFormData(user?: User | null): UserFormData {
  return {
    username: user?.username ?? "",
    password: user?.password ??"issat2026",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "student",
    agentType: user?.agentType ?? "",
    studentGroup: user?.studentGroup ?? "",
    department: user?.department ?? "",
  }
}

function normalizeGroups(payload: unknown): GroupOption[] {
  const extractArray = (value: unknown): unknown[] | null => {
    if (Array.isArray(value)) return value
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>
      for (const key of ["data", "groups", "items", "results"]) {
        if (Array.isArray(record[key])) return record[key] as unknown[]
      }
    }
    return null
  }

  const groups = extractArray(payload)
  if (!groups) return []

  return groups.map((item, index) => {
    if (typeof item === "string") return { value: item, label: item }
    if (item && typeof item === "object") {
      const row = item as Record<string, unknown>
      const value = String(row.id ?? row._id ?? row.slug ?? row.code ?? row.name ?? `group-${index}`)
      const label = String(row.name ?? row.label ?? row.title ?? row.group ?? value)
      return { value, label }
    }
    const fallback = String(item)
    return { value: fallback, label: fallback }
  })
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserFormData>(toFormData())
  const [createStep, setCreateStep] = useState(1)
  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([])
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [groupsLoadError, setGroupsLoadError] = useState<string | null>(null)

  async function fetchUsers() {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(USERS_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error(`Failed to load users (${response.status})`)
      }

      const payload = (await response.json()) as unknown
      setUsers(normalizeUsers(payload))
    } catch {
      setError("Could not load users right now.")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  useEffect(() => {
    if (!isCreateOpen || editingUser) return

    let isMounted = true

    async function fetchGroups() {
      setGroupsLoading(true)
      setGroupsLoadError(null)
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(GROUPS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const text = await response.text()
        const payload = text ? (JSON.parse(text) as unknown) : null

        if (!response.ok) {
          throw new Error(`Could not load groups (${response.status})`)
        }

        if (!isMounted) return
        setGroupOptions(normalizeGroups(payload))
      } catch {
        if (!isMounted) return
        setGroupOptions([])
        setGroupsLoadError("Could not load groups.")
      } finally {
        if (isMounted) setGroupsLoading(false)
      }
    }

    void fetchGroups()

    return () => {
      isMounted = false
    }
  }, [isCreateOpen, editingUser])

  function openCreateModal() {
    setFormError(null)
    setEditingUser(null)
    setFormData(toFormData())
    setCreateStep(1)
    setIsCreateOpen(true)
  }

  function openEditModal(user: User) {
    setFormError(null)
    setEditingUser(user)
    setFormData(toFormData(user))
    setIsCreateOpen(true)
  }

  function closeFormModal() {
    setIsCreateOpen(false)
    setEditingUser(null)
  }

  function closeDetailsModal() {
    setSelectedUser(null)
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete user ${user.username || user.email}?`)) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${USERS_URL}/${user.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user (${response.status})`)
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id))
    } catch {
      setError("Could not delete this user right now.")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    const payload = {
      username: formData.username.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      agentType: formData.agentType.trim() || null,
      studentGroup: formData.studentGroup.trim() || null,
      department: formData.department.trim() || null,
    }

    const token = localStorage.getItem("auth_token")
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    try {
      if (editingUser) {
        const patchResponse = await fetch(`${USERS_URL}/${editingUser.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        })

        if (!patchResponse.ok && (patchResponse.status === 404 || patchResponse.status === 405)) {
          const putResponse = await fetch(`${USERS_URL}/${editingUser.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          })
          if (!putResponse.ok) throw new Error(`Failed to update user (${putResponse.status})`)
        } else if (!patchResponse.ok) {
          throw new Error(`Failed to update user (${patchResponse.status})`)
        }
      } else {
        const createResponse = await fetch(USERS_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...payload,
            password: formData.password.trim(),
          }),
        })
        if (!createResponse.ok) throw new Error(`Failed to create user (${createResponse.status})`)
      }

      closeFormModal()
      await fetchUsers()
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Could not save user.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.studentGroup.toLowerCase().includes(query)
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
          onClick={openCreateModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add user
        </button>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Loading users...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Agent Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Student Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={`${user.email}-${user.username}`} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium text-foreground">{user.username || "-"}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          roleBadgeColors[user.role] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {roleLabels[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {
                        agentTypeLabels[user.agentType] ? user.agentType : " -" 
                      }
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.studentGroup || "-"}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.department || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void handleDelete(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Delete user"
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

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">User details</h2>
              <button
                onClick={closeDetailsModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 text-sm">
              <p><span className="font-medium">Username:</span> {selectedUser.username || "-"}</p>
              <p><span className="font-medium">First name:</span> {selectedUser.firstName || "-"}</p>
              <p><span className="font-medium">Last name:</span> {selectedUser.lastName || "-"}</p>
              <p><span className="font-medium">Email:</span> {selectedUser.email || "-"}</p>
              <p><span className="font-medium">Role:</span> {selectedUser.role || "-"}</p>
              <p><span className="font-medium">Agent type:</span> {selectedUser.agentType || "-"}</p>
              <p><span className="font-medium">Student group:</span> {selectedUser.studentGroup || "-"}</p>
              <p><span className="font-medium">Department:</span> {selectedUser.department || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingUser ? "Update user" : "Add user"}
              </h2>
              <button
                onClick={closeFormModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {formError ? (
                <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-600">{formError}</p>
              ) : null}

              {!editingUser ? (
                <>
                  <p className="text-sm text-muted-foreground">Step {createStep} of 2</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded ${createStep >= 1 ? "bg-primary" : "bg-muted"}`} />
                    <div className={`h-1 flex-1 rounded ${createStep >= 2 ? "bg-primary" : "bg-muted"}`} />
                  </div>

                  {createStep === 1 ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm">
                          First name
                          <input
                            required
                            value={formData.firstName}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          />
                        </label>
                        <label className="grid gap-1 text-sm">
                          Last name
                          <input
                            required
                            value={formData.lastName}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm">
                          Username
                          <input
                            required
                            value={formData.username}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, username: event.target.value }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          />
                        </label>
                        <label className="grid gap-1 text-sm">
                          Role
                          <select
                            required
                            value={formData.role}
                            onChange={(event) =>
                              setFormData((prev) => ({
                                ...prev,
                                role: event.target.value,
                                studentGroup: event.target.value === "student" ? prev.studentGroup : "",
                                department:
                                  event.target.value === "student" || event.target.value === "teacher"
                                    ? prev.department
                                    : "",
                                agentType: event.target.value === "agent" ? prev.agentType : "",
                              }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          >
                            <option value="admin">admin</option>
                            <option value="teacher">teacher</option>
                            <option value="student">student</option>
                            <option value="parent">parent</option>
                            <option value="manager">manager</option>
                            <option value="agent">agent</option>
                            <option value="viewer">viewer</option>
                          </select>
                        </label>
                      </div>

                      {formData.role === "student" ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="grid gap-1 text-sm">
                            Student group
                            <select
                              required
                              value={formData.studentGroup}
                              onChange={(event) =>
                                setFormData((prev) => ({ ...prev, studentGroup: event.target.value }))
                              }
                              disabled={groupsLoading || groupOptions.length === 0}
                              className="rounded-md border border-border bg-background px-3 py-2 disabled:opacity-60"
                            >
                              <option value="">
                                {groupsLoading
                                  ? "Loading groups..."
                                  : groupsLoadError || groupOptions.length === 0
                                    ? "No groups available"
                                    : "Select your group"}
                              </option>
                              {groupOptions.map((group) => (
                                <option key={group.value} value={group.value}>
                                  {group.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="grid gap-1 text-sm">
                            Department
                            <select
                              required
                              value={formData.department}
                              onChange={(event) =>
                                setFormData((prev) => ({ ...prev, department: event.target.value }))
                              }
                              className="rounded-md border border-border bg-background px-3 py-2"
                            >
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                  {department}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      ) : null}

                      {formData.role === "teacher" ? (
                        <label className="grid gap-1 text-sm">
                          Department
                          <select
                            required
                            value={formData.department}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, department: event.target.value }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map((department) => (
                              <option key={department} value={department}>
                                {department}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}

                      {formData.role === "agent" ? (
                        <label className="grid gap-1 text-sm">
                          Agent type
                          <select
                            required
                            value={formData.agentType}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, agentType: event.target.value }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-2"
                          >
                            <option value="">Select agent type</option>
                            {AGENT_TYPES.map((agentType) => (
                              <option key={agentType.value} value={agentType.value}>
                                {agentType.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <label className="grid gap-1 text-sm">
                        Email
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, email: event.target.value }))
                          }
                          className="rounded-md border border-border bg-background px-3 py-2"
                        />
                      </label>

                      <label className="grid gap-1 text-sm">
                        Password
                        <input
                          required
                          type="password"
                          value={formData.password}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, password: event.target.value }))
                          }
                          className="rounded-md border border-border bg-background px-3 py-2"
                        />
                      </label>
                    </>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeFormModal}
                      className="rounded-md border border-border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    {createStep === 1 ? (
                      <button
                        type="button"
                        onClick={() => setCreateStep(2)}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        Next
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setCreateStep(1)}
                          className="rounded-md border border-border px-4 py-2 text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? "Saving..." : "Create user"}
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      First name
                      <input
                        required
                        value={formData.firstName}
                        onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="rounded-md border border-border bg-background px-3 py-2"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Last name
                      <input
                        required
                        value={formData.lastName}
                        onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="rounded-md border border-border bg-background px-3 py-2"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      Agent type
                      <input
                        value={formData.agentType}
                        onChange={(event) => setFormData((prev) => ({ ...prev, agentType: event.target.value }))}
                        className="rounded-md border border-border bg-background px-3 py-2"
                        placeholder="interne / externe / freelance"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Student group
                      <input
                        value={formData.studentGroup}
                        onChange={(event) => setFormData((prev) => ({ ...prev, studentGroup: event.target.value }))}
                        className="rounded-md border border-border bg-background px-3 py-2"
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-sm">
                    Department
                    <input
                      value={formData.department}
                      onChange={(event) => setFormData((prev) => ({ ...prev, department: event.target.value }))}
                      className="rounded-md border border-border bg-background px-3 py-2"
                    />
                  </label>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeFormModal}
                      className="rounded-md border border-border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Saving..." : "Update user"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
