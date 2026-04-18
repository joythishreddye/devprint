import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-zinc-900">DevPrint</p>
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <Link
              href="/compare"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/technologies"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Technologies
            </Link>
            <Link
              href="/sign-up"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Sign Up
            </Link>
          </nav>
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} DevPrint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
