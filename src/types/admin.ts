import type { Contribution, UserRole } from '@/types/database';

export interface AdminDashboardStats {
  pendingSubmissions: number;
  totalTechnologies: number;
  totalUsers: number;
}

export interface ContributionWithContributor extends Contribution {
  contributor_display_name: string;
}

export const ROLE_HIERARCHY = {
  developer: 0,
  contributor: 1,
  admin: 2,
} as const satisfies Record<UserRole, number>;
