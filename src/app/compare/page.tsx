import Link from 'next/link';
import { compareTechnologies, generateComparisonSummary } from '@/lib/comparison';
import { FIXTURE_TECHNOLOGIES, FIXTURE_TECHNOLOGIES_BY_SLUG } from '@/lib/comparison/fixtures';
import { ComparisonClient } from '@/components/comparison/ComparisonClient';
import { CategoryScoreBar } from '@/components/comparison/CategoryScoreBar';
import { ComparisonSummaryPanel } from '@/components/comparison/ComparisonSummaryPanel';

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps): Promise<React.ReactElement> {
  const { a: slugA = '', b: slugB = '' } = await searchParams;

  const techA = FIXTURE_TECHNOLOGIES_BY_SLUG[slugA] ?? null;
  const techB = FIXTURE_TECHNOLOGIES_BY_SLUG[slugB] ?? null;

  const validationError =
    slugA !== '' && slugB !== '' && slugA === slugB
      ? 'Please select two different technologies'
      : null;

  const result = techA && techB && validationError === null
    ? compareTechnologies(techA, techB)
    : null;

  const summary = result ? generateComparisonSummary(result) : null;

  const technologyOptions = FIXTURE_TECHNOLOGIES.map((t) => ({ name: t.name, slug: t.slug }));

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Compare Technologies</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Select two technologies to see a side-by-side comparison with weighted scoring.
          </p>
        </header>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ComparisonClient
            technologies={technologyOptions}
            initialSlugA={slugA}
            initialSlugB={slugB}
            validationError={validationError}
          />
        </div>

        {result && summary && techA && techB && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <TechCard tech={techA} overallScore={result.overallScoreA} winner={result.winner === 'A'} />
              <TechCard tech={techB} overallScore={result.overallScoreB} winner={result.winner === 'B'} />
            </div>

            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Category Scores
              </h2>
              <CategoryScoreBar
                scores={result.categoryScores}
                nameA={techA.name}
                nameB={techB.name}
              />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Analysis
              </h2>
              <ComparisonSummaryPanel
                summary={summary}
                nameA={techA.name}
                nameB={techB.name}
              />
            </div>
          </>
        )}

        {!slugA && !slugB && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center">
            <p className="text-zinc-500">Select two technologies above to start comparing.</p>
            <p className="mt-2 text-xs text-zinc-400">
              Try:{' '}
              {[
                { a: 'react', b: 'svelte' },
                { a: 'react', b: 'vuejs' },
                { a: 'nextjs', b: 'react' },
              ].map(({ a, b }, i) => (
                <span key={`${a}-${b}`}>
                  {i > 0 && ' · '}
                  <Link href={`/compare?a=${a}&b=${b}`} className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2">
                    {FIXTURE_TECHNOLOGIES_BY_SLUG[a]?.name} vs {FIXTURE_TECHNOLOGIES_BY_SLUG[b]?.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TechCardProps {
  tech: { name: string; category: string; description: string; pros: string[]; cons: string[] };
  overallScore: number;
  winner: boolean;
}

function TechCard({ tech, overallScore, winner }: TechCardProps): React.ReactElement {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        winner ? 'border-blue-300 ring-1 ring-blue-200' : 'border-zinc-200'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{tech.name}</h2>
          <span className="text-xs text-zinc-400">{tech.category}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-zinc-800">{(overallScore * 10).toFixed(1)}</span>
          <span className="ml-0.5 text-xs text-zinc-400">/10</span>
          {winner && (
            <p className="mt-0.5 text-xs font-medium text-blue-600">Winner</p>
          )}
        </div>
      </div>
      <p className="mb-4 text-sm text-zinc-500 line-clamp-2">{tech.description}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Pros</h3>
          <ul className="space-y-0.5">
            {tech.pros.slice(0, 3).map((pro) => (
              <li key={pro} className="text-xs text-zinc-600">
                + {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Cons</h3>
          <ul className="space-y-0.5">
            {tech.cons.slice(0, 3).map((con) => (
              <li key={con} className="text-xs text-zinc-600">
                - {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
