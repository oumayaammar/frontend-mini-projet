"use client";

import { getStoredAuthUser, getUserDisplayName } from "@/lib/auth-client";
import { Mail, Shield, User as UserIcon } from "lucide-react";
import { useMemo } from "react";

function asText(value: unknown, fallback = "N/A"): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default function UserAccountDetails() {
  const user = useMemo(() => getStoredAuthUser(), []);
  const role = asText(user?.role);
  const email = asText(user?.email);
  const userId = asText(user?.id);
  const phone = asText(user?.telephone);
  const displayName = getUserDisplayName(user);

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <UserIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Account</h1>
          <p className="text-sm text-muted-foreground">Your profile details</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Full name</p>
          <p className="mt-1 font-medium text-foreground">{displayName}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="mt-1 inline-flex items-center gap-2 font-medium text-foreground">
            <Shield className="h-4 w-4" />
            {role}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="mt-1 inline-flex items-center gap-2 font-medium text-foreground">
            <Mail className="h-4 w-4" />
            {email}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Phone</p>
          <p className="mt-1 font-medium text-foreground">{phone}</p>
        </div>
        <div className="rounded-lg border border-border p-4 sm:col-span-2">
          <p className="text-xs text-muted-foreground">User ID</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{userId}</p>
        </div>
      </div>
    </div>
  );
}
