'use client';

import Link from 'next/link';

export default function WizardEditError() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-lg font-semibold text-zinc-900">Something went wrong</h1>
      <p className="text-sm text-zinc-500">We couldn&apos;t load your plan for editing.</p>
      <Link
        href="/wizard"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Start a new plan
      </Link>
    </div>
  );
}
