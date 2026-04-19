'use client';

import { signOut } from '@/app/(auth)/actions';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={className ?? 'text-sm text-zinc-600 hover:text-zinc-900 transition-colors'}
      >
        Sign out
      </button>
    </form>
  );
}
