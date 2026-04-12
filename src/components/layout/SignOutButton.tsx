'use client';

import { signOut } from '@/app/(auth)/actions';

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
