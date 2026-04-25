"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const LOGIN_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/auth/login`
    : null) ?? "http://localhost:3002/auth/login";

function getRedirectPath(data: Record<string, unknown>): string {
  const user = data.user as Record<string, unknown> | undefined;
  const roleRaw = (user?.role ?? data.role) as string | undefined;
  const role = roleRaw?.toLowerCase() ?? "";

  if (role.includes("admin")) return "/admin-dashboard";
  if (role.includes("teacher") || role.includes("professor") || role === "agent") {
    return "/professor-dashboard";
  }
  if (role.includes("student")) return "/student-dashboard";
  return "/admin-dashboard";
}

function persistSession(data: Record<string, unknown>) {
  const token =
    (typeof data.access_token === "string" && data.access_token) ||
    (typeof data.accessToken === "string" && data.accessToken) ||
    (typeof data.token === "string" && data.token) ||
    undefined;

  if (token) {
    localStorage.setItem("auth_token", token);
  }
  if (data.user && typeof data.user === "object") {
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: Record<string, unknown> = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text) as Record<string, unknown>;
        } catch {
          setError("Invalid response from server.");
          return;
        }
      }

      if (!response.ok) {
        const message =
          (typeof data.message === "string" && data.message) ||
          (typeof data.error === "string" && data.error) ||
          `Sign in failed (${response.status}).`;
        setError(message);
        return;
      }

      persistSession(data);
      router.push(getRedirectPath(data));
    } catch {
      setError("Could not reach the server. Is it running on port 3002?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with your email and password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          You dont have an account ?{" "}
          <Link href="/sign-up" className="font-medium text-slate-900 hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
