import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-zinc-500">
        The page you were looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Go home
        </Link>
        <Link
          href="/technologies"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Browse technologies
        </Link>
      </div>
    </div>
  );
}
