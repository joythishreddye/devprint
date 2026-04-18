'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        {error.digest
          ? `An unexpected error occurred (ref: ${error.digest}). Please try again or return home.`
          : 'An unexpected error occurred. Please try again or return home.'}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
