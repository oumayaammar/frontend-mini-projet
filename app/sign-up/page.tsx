import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Sign Up</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an account by filling in the information below.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Your last name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>
          <div>
            <label htmlFor="userName" className="mb-1 block text-sm font-medium text-slate-700">
              User Name
            </label>
            <input
              id="userName"
              type="text"
              placeholder="Your user name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>

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
          <div>
            <label htmlFor="passwordConfirmation" className="mb-1 block text-sm font-medium text-slate-700">
              Confirm your password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="********"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>
          <div>
            <label htmlFor="terms" className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select id="terms" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500">
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="FieldOfStudy" className="mb-1 block text-sm font-medium text-slate-700">Field of Study (only for students)</label>
            <select id="group" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500">
              <option value="">Select your Field</option>
              <option value="ing">ING</option>
              <option value="lsi">LSI</option>
              <option value="lisi">LISI</option>
              <option value="eea">EEA</option>
            </select>
          </div>
          <div>
            <label htmlFor="group" className="mb-1 block text-sm font-medium text-slate-700">Group (only for students)</label>
            <select id="group" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-slate-500">
              <option value="">Select your group</option>
              <option value="group1">Group 1</option>
              <option value="group2">Group 2</option>
              <option value="group3">Group 3</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
          >
            Create my account
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          You already have an account ?{" "}
          <Link href="/sign-in" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}