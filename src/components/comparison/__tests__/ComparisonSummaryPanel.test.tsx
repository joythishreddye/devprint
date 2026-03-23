import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonSummaryPanel } from '../ComparisonSummaryPanel';
import type { ComparisonSummary } from '@/types/comparison';

const fullSummary: ComparisonSummary = {
  recommendation: 'React edges ahead overall, but Svelte has clear strengths in specific areas.',
  advantages: {
    techA: ['Stronger Community & Support (9.5 vs 6)', 'Stronger Ecosystem & Libraries (10 vs 7)'],
    techB: ['Stronger Performance (7 vs 6)', 'Stronger Learning Curve (9 vs 6)'],
  },
  tradeoffs: [
    'Community & Support: React leads by 3.5 points',
    'Learning Curve: Svelte leads by 3.0 points',
    'Ecosystem & Libraries: React leads by 3.0 points',
  ],
  bestFor: {
    techA: 'Projects prioritizing Community & Support and Ecosystem & Libraries',
    techB: 'Projects prioritizing Performance and Learning Curve',
  },
};

const tieSummary: ComparisonSummary = {
  recommendation: 'React and Vue.js are evenly matched — either is a strong choice.',
  advantages: { techA: [], techB: [] },
  tradeoffs: ['React and Vue.js are very close across all categories'],
  bestFor: {
    techA: 'General-purpose projects in the frontend-framework space',
    techB: 'General-purpose projects in the frontend-framework space',
  },
};

describe('ComparisonSummaryPanel', () => {
  it('renders the recommendation text', () => {
    render(<ComparisonSummaryPanel summary={fullSummary} nameA="React" nameB="Svelte" />);
    expect(screen.getByText(fullSummary.recommendation)).toBeInTheDocument();
  });

  it('renders advantages for tech A under a heading containing nameA', () => {
    render(<ComparisonSummaryPanel summary={fullSummary} nameA="React" nameB="Svelte" />);
    expect(screen.getByText('Stronger Community & Support (9.5 vs 6)')).toBeInTheDocument();
    expect(screen.getByText('Stronger Ecosystem & Libraries (10 vs 7)')).toBeInTheDocument();
  });

  it('renders advantages for tech B under a heading containing nameB', () => {
    render(<ComparisonSummaryPanel summary={fullSummary} nameA="React" nameB="Svelte" />);
    expect(screen.getByText('Stronger Performance (7 vs 6)')).toBeInTheDocument();
    expect(screen.getByText('Stronger Learning Curve (9 vs 6)')).toBeInTheDocument();
  });

  it('renders all tradeoff strings', () => {
    render(<ComparisonSummaryPanel summary={fullSummary} nameA="React" nameB="Svelte" />);
    for (const tradeoff of fullSummary.tradeoffs) {
      expect(screen.getByText(tradeoff)).toBeInTheDocument();
    }
  });

  it('renders bestFor descriptions for both technologies', () => {
    render(<ComparisonSummaryPanel summary={fullSummary} nameA="React" nameB="Svelte" />);
    expect(screen.getByText(fullSummary.bestFor.techA)).toBeInTheDocument();
    expect(screen.getByText(fullSummary.bestFor.techB)).toBeInTheDocument();
  });

  it('renders gracefully when advantages arrays are empty', () => {
    expect(() => {
      render(<ComparisonSummaryPanel summary={tieSummary} nameA="React" nameB="Vue.js" />);
    }).not.toThrow();
    expect(screen.getByText(tieSummary.recommendation)).toBeInTheDocument();
  });

  it('renders tie scenario recommendation containing "either"', () => {
    render(<ComparisonSummaryPanel summary={tieSummary} nameA="React" nameB="Vue.js" />);
    expect(screen.getByText(/either/i)).toBeInTheDocument();
  });
});
