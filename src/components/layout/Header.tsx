import Link from 'next/link';
import SignOutButton from './SignOutButton';

async function getUser() {
  // Supabase env vars may be absent during build-time prerender
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  try {
    const { createServerClient } = await import('@/lib/supabase/server');
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function Header() {
  const user = await getUser();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-zinc-900">
            DevPrint
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/wizard"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Wizard
                </Link>
                <Link
                  href="/contributor"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Contribute
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
