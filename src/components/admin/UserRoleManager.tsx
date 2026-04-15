'use client';

import { useState, useTransition } from 'react';
import { promoteUserAction } from '@/app/admin/actions';
import { canPromoteTo } from '@/lib/admin/roles';
import type { UserProfile, UserRole } from '@/types/database';

export interface UserRoleManagerProps {
  users: UserProfile[];
  currentUserId: string;
}

export function UserRoleManager({ users: initialUsers, currentUserId }: UserRoleManagerProps) {
  const [users, setUsers] = useState(initialUsers);

  function handlePromoted(userId: string, newRole: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          isSelf={user.id === currentUserId}
          onPromoted={(newRole) => handlePromoted(user.id, newRole)}
        />
      ))}
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  onPromoted,
}: {
  user: UserProfile;
  isSelf: boolean;
  onPromoted: (newRole: UserRole) => void;
}) {
  const promotionTargets = canPromoteTo(user.role);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    promotionTargets[0] ?? user.role,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePromote() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set('userId', user.id);
      formData.set('newRole', selectedRole);
      const result = await promoteUserAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onPromoted(selectedRole);
    });
  }

  const roleBadgeClass: Record<UserRole, string> = {
    developer: 'bg-zinc-100 text-zinc-700',
    contributor: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-900 truncate">{user.display_name}</p>
          {isSelf && <span className="text-xs text-zinc-400">(you)</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleBadgeClass[user.role]}`}
          >
            {user.role}
          </span>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>

      {!isSelf && promotionTargets.length > 0 && (
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {promotionTargets.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handlePromote}
            disabled={isPending}
            className="rounded px-2 py-1 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Promoting…' : 'Promote'}
          </button>
        </div>
      )}
    </div>
  );
}
