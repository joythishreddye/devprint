import Link from 'next/link';
import { getFeaturedTechnologies } from '@/lib/supabase/queries/get-featured-technologies';
import { TechnologyCard } from '@/components/ui/TechnologyCard';

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Explore',
    description:
      'Browse a curated library of technologies across frameworks, databases, languages, and tools.',
  },
  {
    number: '02',
    title: 'Compare',
    description:
      'Run side-by-side comparisons scored across performance, developer experience, ecosystem, and more.',
  },
  {
    number: '03',
    title: 'Generate',
    description:
      'Export ready-to-use config files for Claude Code, GitHub Copilot, and Gemini CLI tailored to your stack.',
  },
] as const;

export default async function HomePage() {
  const technologies = await getFeaturedTechnologies();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 mb-4">
            Development Planning
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Choose your tech stack
            <br />
            <span className="text-zinc-500">with confidence</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-zinc-600">
            DevPrint helps you evaluate and compare technologies side by side, so you can make
            informed decisions before you write a single line of code. Compare frameworks, generate
            AI tool configs, and plan your project from day one.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/wizard"
              className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Start Planning
            </Link>
            <Link
              href="/technologies"
              className="rounded-full border border-zinc-300 bg-white px-8 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
            >
              Browse Technologies
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">How it works</h2>
            <p className="mt-3 text-zinc-600">
              From exploration to configuration in three steps.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <span className="text-4xl font-bold text-zinc-200 leading-none">{step.number}</span>
                <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Technologies */}
      <section className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                Popular Technologies
              </h2>
              <p className="mt-2 text-zinc-600">
                Explore the most-compared tools in the DevPrint library.
              </p>
            </div>
            <Link
              href="/technologies"
              className="shrink-0 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Browse all technologies &rarr;
            </Link>
          </div>

          {technologies.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech) => (
                <TechnologyCard key={tech.id} technology={tech} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-12">
              No technologies available yet.{' '}
              <Link href="/compare" className="underline hover:text-zinc-700">
                Try the comparison tool
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-semibold text-zinc-900">DevPrint</p>
            <nav className="flex items-center gap-6">
              <Link
                href="/compare"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/technologies"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Technologies
              </Link>
              <Link
                href="/sign-up"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} DevPrint. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
