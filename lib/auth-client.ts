"use client";

export type AuthUser = Record<string, unknown>;

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return "User";

  const firstName =
    (typeof user.prenom === "string" && user.prenom) ||
    (typeof user.firstName === "string" && user.firstName) ||
    "";
  const lastName =
    (typeof user.nom === "string" && user.nom) ||
    (typeof user.lastName === "string" && user.lastName) ||
    "";
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) return fullName;
  if (typeof user.name === "string" && user.name) return user.name;
  if (typeof user.fullName === "string" && user.fullName) return user.fullName;
  if (typeof user.username === "string" && user.username) return user.username;
  if (typeof user.email === "string" && user.email) return user.email;

  return "User";
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}
