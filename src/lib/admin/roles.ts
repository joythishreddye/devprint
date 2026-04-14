import type { UserRole } from '@/types/database';
import { ROLE_HIERARCHY } from '@/types/admin';

/** Returns true only if newRole is strictly higher than currentRole in the hierarchy */
export function isPromotion(currentRole: UserRole, newRole: UserRole): boolean {
  return ROLE_HIERARCHY[newRole] > ROLE_HIERARCHY[currentRole];
}

/** Returns the list of roles a user can be promoted to (all roles strictly above current) */
export function canPromoteTo(currentRole: UserRole): UserRole[] {
  return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter(
    (role) => ROLE_HIERARCHY[role] > ROLE_HIERARCHY[currentRole],
  );
}
