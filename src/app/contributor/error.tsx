'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-12 text-center max-w-md mx-auto mt-12">
      <h2 className="text-base font-semibold text-zinc-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
