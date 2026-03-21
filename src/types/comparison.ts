import type { Technology } from './database';

export interface CategoryScore {
  category: string;
  scoreA: number;
  scoreB: number;
  weight: number;
  normalizedScoreA: number;
  normalizedScoreB: number;
}

export interface ComparisonResult {
  techA: Pick<Technology, 'name' | 'slug' | 'category'>;
  techB: Pick<Technology, 'name' | 'slug' | 'category'>;
  categoryScores: CategoryScore[];
  overallScoreA: number;
  overallScoreB: number;
  winner: 'A' | 'B' | 'tie';
}

export interface ComparisonSummary {
  recommendation: string;
  advantages: {
    techA: string[];
    techB: string[];
  };
  tradeoffs: string[];
  bestFor: {
    techA: string;
    techB: string;
  };
}

export type ComparisonCategory =
  | 'performance'
  | 'developer_experience'
  | 'community'
  | 'learning_curve'
  | 'ecosystem'
  | 'maturity';

export const CATEGORY_WEIGHTS: Record<ComparisonCategory, number> = {
  performance: 0.2,
  developer_experience: 0.25,
  community: 0.15,
  learning_curve: 0.15,
  ecosystem: 0.15,
  maturity: 0.1,
};
