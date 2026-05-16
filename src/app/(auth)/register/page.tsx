import { signup } from '../actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-2xl font-semibold text-center mb-6">Create an Account</h1>
        <label className="text-md" htmlFor="name">
          Full Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="name"
          placeholder="John Doe"
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          formAction={signup}
          className="bg-green-600 rounded-md px-4 py-2 text-white font-medium mb-2 hover:bg-green-700 transition"
        >
          Sign Up
        </button>
        <p className="text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
        </p>
        {message && (
          <p className="mt-4 p-4 bg-red-100 text-red-800 text-center rounded-md">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
