import Link from 'next/link';

export default function PlanNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-sm font-medium text-zinc-700">Plan not found</p>
      <p className="text-sm text-zinc-500">
        This plan may have been deleted or doesn&apos;t belong to your account.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
