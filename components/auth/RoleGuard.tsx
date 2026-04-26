"use client"

import { ReactNode, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AppPageSkeleton from "../skeletons/AppPageSkeleton"

type RoleGuardProps = {
  allowedRoles: string[]
  children: ReactNode
}

function resolveDashboard(role: string) {
  if (role.includes("admin")) return "/admin-dashboard"
  if (role.includes("student")) return "/student-dashboard"
  if (role.includes("agent")) return "/agent-dashboard"
  if (role.includes("teacher") || role.includes("professor")) return "/professor-dashboard"
  return "/sign-in"
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  const normalizedAllowedRoles = useMemo(
    () => allowedRoles.map((role) => role.toLowerCase()),
    [allowedRoles],
  )

  useEffect(() => {
    const stored = localStorage.getItem("auth_user")
    if (!stored) {
      router.replace("/sign-in")
      return
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>
      const role = String(parsed.role ?? "").toLowerCase()

      if (!role) {
        router.replace("/sign-in")
        return
      }

      const allowed = normalizedAllowedRoles.some((allowedRole) =>
        role.includes(allowedRole),
      )

      if (!allowed) {
        router.replace(resolveDashboard(role))
        return
      }

      setIsAuthorized(true)
    } catch {
      router.replace("/sign-in")
    }
  }, [normalizedAllowedRoles, router])

  if (!isAuthorized) {
    return <div className="p-4 text-sm text-muted-foreground"><AppPageSkeleton/></div>
  }

  return <>{children}</>
}
