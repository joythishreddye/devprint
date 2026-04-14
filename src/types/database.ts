export type UserRole = 'developer' | 'contributor' | 'admin';

export const CONTRIBUTION_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;
export type ContributionStatus = typeof CONTRIBUTION_STATUS[keyof typeof CONTRIBUTION_STATUS];

/** Technology fields submitted by contributors — excludes server-generated columns */
export type TechnologySubmission = Omit<Technology, 'id' | 'created_at' | 'updated_at'>;

// Converts an interface to a plain mapped object type so it satisfies
// Record<string, unknown> — required by @supabase/postgrest-js GenericTable.
type Plainify<T> = { [K in keyof T]: T[K] };

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  github_url: string | null;
  npm_package: string | null;
  github_stars: number | null;
  npm_weekly_downloads: number | null;
  pros: string[];
  cons: string[];
  best_for: string[];
  learning_curve: 'beginner' | 'intermediate' | 'advanced';
  community_size: 'small' | 'medium' | 'large';
  maturity: 'emerging' | 'growing' | 'mature' | 'declining';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Comparison {
  id: string;
  tech_a_id: string;
  tech_b_id: string;
  comparison_data: Record<string, unknown>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectPlan {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  selections: Record<string, unknown>;
  config_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  contributor_id: string;
  technology_data: Record<string, unknown>;
  status: ContributionStatus;
  reviewer_id: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      technologies: {
        Row: Plainify<Technology>;
        Insert: Omit<Technology, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Technology, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      comparisons: {
        Row: Plainify<Comparison>;
        Insert: Omit<Comparison, 'id' | 'created_at'>;
        Update: Partial<Omit<Comparison, 'id' | 'created_at'>>;
        Relationships: [];
      };
      user_profiles: {
        Row: Plainify<UserProfile>;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      project_plans: {
        Row: Plainify<ProjectPlan>;
        Insert: Omit<ProjectPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProjectPlan, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      contributions: {
        Row: Plainify<Contribution>;
        Insert: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contribution, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
