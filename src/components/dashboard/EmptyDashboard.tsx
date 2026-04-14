import Link from 'next/link';

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
        <svg className="h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-700">No plans yet</p>
        <p className="text-sm text-zinc-500">
          Use the wizard to plan your tech stack and generate config files.
        </p>
      </div>
      <Link
        href="/wizard"
        className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Start planning
      </Link>
    </div>
  );
}
