import Link from 'next/link';

export function AccessDenied() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-12 text-center max-w-md mx-auto mt-12">
      <h2 className="text-base font-semibold text-zinc-900">Access restricted</h2>
      <p className="mt-2 text-sm text-zinc-500">
        The contributor panel is available to approved contributors only. If you would like to
        contribute technology data, please reach out to the DevPrint team.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
