"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthPageSkeleton from "@/components/skeletons/AuthPageSkeleton";

type UserType = "admin" | "student" | "teacher" | "agent" | "";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ?? "http://localhost:3002";

const REGISTER_URL = `${API_BASE}/auth/register`;
const GROUPS_URL = `${API_BASE}/users/groups`;

const DEPARTMENTS = [
  "informatique",
  "EEA",
  "LISI",
  "LSI",
  "Mecanique",
  "Energétique",
  "electronique",
  "Génie Civile",
] as const;

const AGENT_TYPES = [
  { value: "agent_sup", label: "Agent sup" },
  { value: "agent_administartif", label: "Agent administratif" },
  { value: "technicien", label: "Technicien" },
  { value: "resp_biblio", label: "Resp. bibliothèque" },
] as const;

type GroupOption = { value: string; label: string };

function normalizeGroups(payload: unknown): GroupOption[] {
  const extractArray = (v: unknown): unknown[] | null => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      for (const key of ["data", "groups", "items", "results"]) {
        const inner = o[key];
        if (Array.isArray(inner)) return inner;
      }
    }
    return null;
  };

  const arr = extractArray(payload);
  if (!arr) return [];

  return arr.map((item, i) => {
    if (typeof item === "string") return { value: item, label: item };
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const value = String(o.id ?? o._id ?? o.slug ?? o.code ?? o.name ?? o.groupId ?? `group-${i}`);
      const label = String(o.name ?? o.label ?? o.title ?? o.group ?? value);
      return { value, label };
    }
    return { value: String(item), label: String(item) };
  });
}

function getRedirectPath(data: Record<string, unknown>): string | null {
  const user = data.user as Record<string, unknown> | undefined;
  const roleRaw = (user?.role ?? data.role) as string | undefined;
  const role = roleRaw?.toLowerCase() ?? "";

  if (role.includes("admin")) return "/admin-dashboard";
  if (role.includes("teacher") || role.includes("professor") || role === "agent") {
    return "/professor-dashboard";
  }
  if (role.includes("student")) return "/student-dashboard";
  return null;
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

const selectClassName =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [agentType, setAgentType] = useState("");

  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsLoadError, setGroupsLoadError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      setGroupsLoading(true);
      setGroupsLoadError(null);
      try {
        const response = await fetch(GROUPS_URL);
        const text = await response.text();
        let parsed: unknown = null;
        if (text) {
          try {
            parsed = JSON.parse(text) as unknown;
          } catch {
            if (!cancelled) setGroupsLoadError("Invalid groups response from server.");
            return;
          }
        }
        if (!response.ok) {
          if (!cancelled) {
            setGroupsLoadError(
              typeof parsed === "object" && parsed && "message" in parsed
                ? String((parsed as { message: unknown }).message)
                : `Could not load groups (${response.status}).`,
            );
            setGroupOptions([]);
          }
          return;
        }
        if (!cancelled) setGroupOptions(normalizeGroups(parsed));
      } catch {
        if (!cancelled) {
          setGroupsLoadError("Could not reach the server to load groups.");
          setGroupOptions([]);
        }
      } finally {
        if (!cancelled) setGroupsLoading(false);
      }
    }

    void loadGroups();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step !== 2 || !userType) return;

    setError(null);
    setLoading(true);

    const body = {
      email,
      password,
      firstName,
      lastName,
      username,
      role: userType,
      agentType: userType === "agent" ? agentType : null,
      studentGroup: userType === "student" ? studentGroup : null,
      department: userType === "student" || userType === "teacher" ? department : null,
    };

    console.log(body);

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
          `Registration failed (${response.status}).`;
        setError(message);
        return;
      }

      persistSession(data);
      const path = getRedirectPath(data);
      router.push(path ?? "/sign-in");
    } catch {
      setError("Could not reach the server. Is it running on port 3002?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading ? <AuthPageSkeleton/> : 
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Sign Up</h1>
        <p className="mt-2 text-sm text-slate-600">
          Step {step} of 2 -{" "}
          {step === 1 ? "User informations" : "Login informations"}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? "bg-slate-900" : "bg-slate-200"}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? "bg-slate-900" : "bg-slate-200"}`} />
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          {step === 1 && (
            <>
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your last name"
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="userName" className="mb-1 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="userName"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="userType" className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(event) => setUserType(event.target.value as UserType)}
                  className={selectClassName}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="agent">Agent</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                  required
                />
              </div>

              {userType === "student" && (
                <>
                  <div>
                    <label htmlFor="studentGroup" className="mb-1 block text-sm font-medium text-slate-700">
                      Student group
                    </label>
                    <select
                      id="studentGroup"
                      value={studentGroup}
                      onChange={(e) => setStudentGroup(e.target.value)}
                      className={selectClassName}
                      required
                      disabled={groupsLoading || !!groupsLoadError || groupOptions.length === 0}
                    >
                      <option value="">
                        {groupsLoading
                          ? "Loading groups…"
                          : groupsLoadError || groupOptions.length === 0
                            ? "No groups available"
                            : "Select your group"}
                      </option>
                      {groupOptions.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                    {groupsLoadError ? (
                      <p className="mt-1 text-xs text-red-600">{groupsLoadError}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="studentDepartment" className="mb-1 block text-sm font-medium text-slate-700">
                      Department
                    </label>
                    <select
                      id="studentDepartment"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={selectClassName}
                      required
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {userType === "teacher" && (
                <div>
                  <label htmlFor="teacherDepartment" className="mb-1 block text-sm font-medium text-slate-700">
                    Department
                  </label>
                  <select
                    id="teacherDepartment"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={selectClassName}
                    required
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {userType === "agent" && (
                <div>
                  <label htmlFor="agentType" className="mb-1 block text-sm font-medium text-slate-700">
                    Agent type
                  </label>
                  <select
                    id="agentType"
                    value={agentType}
                    onChange={(e) => setAgentType(e.target.value)}
                    className={selectClassName}
                    required
                  >
                    <option value="">Select agent type</option>
                    {AGENT_TYPES.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (userType === "student" &&
                      (groupsLoading || !!groupsLoadError || groupOptions.length === 0))
                  }
                  className="w-1/2 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating…" : "Create my account"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-4 text-sm text-slate-600">
          You already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
    }
    </>
  );
}
