'use client';

import { useState, useEffect } from 'react';
import type { WizardOption } from '@/types/wizard';
import type { Technology } from '@/types/database';
import { compareTechnologies, generateComparisonSummary } from '@/lib/comparison';
import { CategoryScoreBar } from '@/components/comparison/CategoryScoreBar';
import { ComparisonSummaryPanel } from '@/components/comparison/ComparisonSummaryPanel';

export interface WizardComparePanelProps {
  options: WizardOption[];
  stepTitle: string;
  onClose: () => void;
}

/**
 * Derives a Technology-like object from a WizardOption for the comparison engine.
 * learning_curve, community_size, and maturity are heuristic approximations based
 * on prose keywords and pros/cons counts — they produce relative scores for ranking
 * two options within the same step, not absolute quality ratings.
 */
function buildTechnology(option: WizardOption, stepId: string): Technology {
  const prosText = option.pros.join(' ').toLowerCase();
  const consText = option.cons.join(' ').toLowerCase();

  const isEasy =
    prosText.includes('easy') ||
    prosText.includes('gentle') ||
    prosText.includes('simple') ||
    prosText.includes('fast to');
  const isHard =
    consText.includes('complex') ||
    consText.includes('steep') ||
    consText.includes('verbose') ||
    consText.includes('difficult');
  const learning_curve: Technology['learning_curve'] = isEasy
    ? 'beginner'
    : isHard
      ? 'advanced'
      : 'intermediate';

  const community_size: Technology['community_size'] =
    option.pros.length >= 4 ? 'large' : option.pros.length >= 2 ? 'medium' : 'small';

  const maturity: Technology['maturity'] =
    option.cons.length <= 1 ? 'mature' : option.cons.length <= 2 ? 'growing' : 'emerging';

  return {
    id: option.value,
    name: option.name,
    slug: option.value.toLowerCase().replace(/\s+/g, '-'),
    category: stepId,
    description: option.description,
    logo_url: null,
    website_url: null,
    github_url: null,
    npm_package: null,
    github_stars: null,
    npm_weekly_downloads: null,
    pros: option.pros,
    cons: option.cons,
    best_for: option.pros.slice(0, 2),
    learning_curve,
    community_size,
    maturity,
    metadata: {},
    created_at: '',
    updated_at: '',
  };
}

const SELECTABLE_LABEL = 'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150';
const SELECTED_STYLE = 'border-zinc-900 bg-zinc-900 text-white';
const UNSELECTED_STYLE = 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300';

export function WizardComparePanel({ options, stepTitle, onClose }: WizardComparePanelProps) {
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);

  // Close panel on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const optionA = options.find((o) => o.value === selectedA) ?? null;
  const optionB = options.find((o) => o.value === selectedB) ?? null;

  const result =
    optionA && optionB && selectedA !== selectedB
      ? compareTechnologies(
          buildTechnology(optionA, stepTitle),
          buildTechnology(optionB, stepTitle),
        )
      : null;

  const summary = result ? generateComparisonSummary(result) : null;

  function handleSelectA(value: string) {
    setSelectedA(value === selectedA ? null : value);
    if (value === selectedB) setSelectedB(null);
  }

  function handleSelectB(value: string) {
    setSelectedB(value === selectedB ? null : value);
    if (value === selectedA) setSelectedA(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Compare ${stepTitle} options`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Compare {stepTitle} Options</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Select two options below to compare them.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close compare panel"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Option A selector */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Option A</p>
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectA(opt.value)}
                  disabled={opt.value === selectedB}
                  className={[
                    SELECTABLE_LABEL,
                    selectedA === opt.value
                      ? SELECTED_STYLE
                      : opt.value === selectedB
                        ? 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                        : UNSELECTED_STYLE,
                  ].join(' ')}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Option B selector */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Option B</p>
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectB(opt.value)}
                  disabled={opt.value === selectedA}
                  className={[
                    SELECTABLE_LABEL,
                    selectedB === opt.value
                      ? SELECTED_STYLE
                      : opt.value === selectedA
                        ? 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                        : UNSELECTED_STYLE,
                  ].join(' ')}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt when not both selected */}
          {(!selectedA || !selectedB) && (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
              <p className="text-sm text-zinc-500">
                {!selectedA && !selectedB
                  ? 'Pick one option for A and one for B above.'
                  : !selectedA
                    ? 'Now pick an option for A.'
                    : 'Now pick an option for B.'}
              </p>
            </div>
          )}

          {/* Comparison results */}
          {result && summary && optionA && optionB && (
            <div className="flex flex-col gap-4">
              {/* Tech score cards */}
              <div className="grid grid-cols-2 gap-3">
                <WizardTechCard option={optionA} score={result.overallScoreA} winner={result.winner === 'A'} />
                <WizardTechCard option={optionB} score={result.overallScoreB} winner={result.winner === 'B'} />
              </div>

              {/* Category scores */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Category Scores
                </h3>
                <CategoryScoreBar
                  scores={result.categoryScores}
                  nameA={optionA.name}
                  nameB={optionB.name}
                />
              </div>

              {/* Analysis */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Analysis
                </h3>
                <ComparisonSummaryPanel
                  summary={summary}
                  nameA={optionA.name}
                  nameB={optionB.name}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface WizardTechCardProps {
  option: WizardOption;
  score: number;
  winner: boolean;
}

function WizardTechCard({ option, score, winner }: WizardTechCardProps) {
  return (
    <div
      className={[
        'rounded-xl border bg-white p-4 shadow-sm',
        winner ? 'border-blue-300 ring-1 ring-blue-200' : 'border-zinc-200',
      ].join(' ')}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">{option.name}</h3>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xl font-bold text-zinc-800">{(score * 10).toFixed(1)}</span>
          <span className="ml-0.5 text-xs text-zinc-400">/10</span>
          {winner && <p className="mt-0.5 text-xs font-medium text-blue-600">Winner</p>}
        </div>
      </div>
      <p className="mb-3 text-xs text-zinc-500 line-clamp-2">{option.description}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Pros</p>
          <ul className="space-y-0.5">
            {option.pros.slice(0, 3).map((pro) => (
              <li key={pro} className="text-xs text-zinc-600">+ {pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Cons</p>
          <ul className="space-y-0.5">
            {option.cons.slice(0, 3).map((con) => (
              <li key={con} className="text-xs text-zinc-600">- {con}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
