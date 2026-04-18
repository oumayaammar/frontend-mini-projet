"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type UserRole = "admin" | "manager" | "agent" | "viewer"
export type AgentType = "interne" | "externe" | "freelance"

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: UserRole
  agentType: AgentType
  telephone: string
  photo?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  nom: string
  prenom: string
  role: UserRole
  agentType: AgentType
  telephone: string
  photo?: string
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string
}


// Sample data
export const initialUsers: User[] = [
  {
    id: "1",
    email: "jean.dupont@example.com",
    nom: "Dupont",
    prenom: "Jean",
    role: "admin",
    agentType: "interne",
    telephone: "+33 6 12 34 56 78",
    photo: undefined,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "marie.martin@example.com",
    nom: "Martin",
    prenom: "Marie",
    role: "manager",
    agentType: "interne",
    telephone: "+33 6 98 76 54 32",
    photo: undefined,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    email: "pierre.bernard@example.com",
    nom: "Bernard",
    prenom: "Pierre",
    role: "agent",
    agentType: "externe",
    telephone: "+33 6 55 44 33 22",
    photo: undefined,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
]

interface UsersContextType {
  users: User[]
  addUser: (input: CreateUserInput) => User
  updateUser: (input: UpdateUserInput) => User | null
  deleteUser: (id: string) => boolean
  getUser: (id: string) => User | undefined
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const addUser = useCallback((input: CreateUserInput): User => {
    const newUser: User = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setUsers((prev) => [...prev, newUser])
    return newUser
  }, [])

  const updateUser = useCallback((input: UpdateUserInput): User | null => {
    let updatedUser: User | null = null
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === input.id) {
          updatedUser = {
            ...user,
            ...input,
            updatedAt: new Date(),
          }
          return updatedUser
        }
        return user
      })
    )
    return updatedUser
  }, [])

  const deleteUser = useCallback((id: string): boolean => {
    let deleted = false
    setUsers((prev) => {
      const filtered = prev.filter((user) => user.id !== id)
      deleted = filtered.length < prev.length
      return filtered
    })
    return deleted
  }, [])

  const getUser = useCallback(
    (id: string): User | undefined => {
      return users.find((user) => user.id === id)
    },
    [users]
  )

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser, getUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}
