'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

interface MobileMenuProps {
  links: { href: string; label: string }[];
  isAuthenticated: boolean;
}

export default function MobileMenu({ links, isAuthenticated }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900"
      >
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-14 z-40 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm"
        >
          <ul className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <li className="mt-1 border-t border-zinc-100 pt-1">
                <SignOutButton className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors" />
              </li>
            ) : (
              <>
                <li className="mt-1 border-t border-zinc-100 pt-1">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="block rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
