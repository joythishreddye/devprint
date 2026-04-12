'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUp, type AuthState } from '../actions';

const initialState: AuthState = {};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-zinc-200 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Check your email</h2>
          <p className="text-sm text-zinc-500">{state.success}</p>
          <Link href="/sign-in" className="mt-6 inline-block text-sm font-medium text-zinc-900 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Create an account</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Sign up to save project plans and generate config files.
        </p>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-zinc-700 mb-1">
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Your name"
            />
            {state.fieldErrors?.display_name && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.display_name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="you@example.com"
            />
            {state.fieldErrors?.email && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="••••••••"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-zinc-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
