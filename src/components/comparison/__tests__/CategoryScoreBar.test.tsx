import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryScoreBar } from '../CategoryScoreBar';
import type { CategoryScore } from '@/types/comparison';

const sixScores: CategoryScore[] = [
  { category: 'performance', scoreA: 6, scoreB: 7, weight: 0.2, normalizedScoreA: 6, normalizedScoreB: 7 },
  { category: 'developer_experience', scoreA: 7, scoreB: 8, weight: 0.25, normalizedScoreA: 7, normalizedScoreB: 8 },
  { category: 'community', scoreA: 9.5, scoreB: 6, weight: 0.15, normalizedScoreA: 9.5, normalizedScoreB: 6 },
  { category: 'learning_curve', scoreA: 6, scoreB: 9, weight: 0.15, normalizedScoreA: 6, normalizedScoreB: 9 },
  { category: 'ecosystem', scoreA: 10, scoreB: 7, weight: 0.15, normalizedScoreA: 10, normalizedScoreB: 7 },
  { category: 'maturity', scoreA: 9, scoreB: 7, weight: 0.1, normalizedScoreA: 9, normalizedScoreB: 7 },
];

const singleScore: CategoryScore[] = [
  { category: 'developer_experience', scoreA: 7.5, scoreB: 6.0, weight: 0.25, normalizedScoreA: 7.5, normalizedScoreB: 6.0 },
];

describe('CategoryScoreBar', () => {
  it('renders one row for each category score', () => {
    render(<CategoryScoreBar scores={sixScores} nameA="React" nameB="Svelte" />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(6);
  });

  it('displays human-readable category label instead of raw key', () => {
    render(<CategoryScoreBar scores={singleScore} nameA="React" nameB="Svelte" />);
    expect(screen.getByText('Developer Experience')).toBeInTheDocument();
    expect(screen.queryByText('developer_experience')).not.toBeInTheDocument();
  });

  it('renders technology names as column headers', () => {
    render(<CategoryScoreBar scores={singleScore} nameA="React" nameB="Svelte" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Svelte')).toBeInTheDocument();
  });

  it('displays numeric scores for each row', () => {
    render(<CategoryScoreBar scores={singleScore} nameA="React" nameB="Svelte" />);
    expect(screen.getByText('7.5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('applies a wider bar to the higher-scoring technology', () => {
    render(<CategoryScoreBar scores={singleScore} nameA="React" nameB="Svelte" />);
    const bars = screen.getAllByTestId('score-bar');
    const barA = bars[0] as HTMLElement;
    const barB = bars[1] as HTMLElement;
    const widthA = parseFloat(barA.style.width);
    const widthB = parseFloat(barB.style.width);
    // normalizedScoreA (7.5) > normalizedScoreB (6.0), so bar A should be wider
    expect(widthA).toBeGreaterThan(widthB);
  });

  it('renders without throwing when scores array is empty', () => {
    expect(() => {
      render(<CategoryScoreBar scores={[]} nameA="React" nameB="Svelte" />);
    }).not.toThrow();
  });
});
