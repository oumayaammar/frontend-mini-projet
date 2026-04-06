import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with your email and password.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="yourname@example.com"
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
              placeholder="********"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          You don't have an account ?{" "}
          <Link href="/sign-up" className="font-medium text-slate-900 hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
