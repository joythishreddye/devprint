import type { Technology } from '@/types/database';

const react: Technology = {
  id: '1',
  name: 'React',
  slug: 'react',
  category: 'frontend-framework',
  description: 'A JavaScript library for building user interfaces. Maintained by Meta, React is the most widely adopted UI library in the ecosystem.',
  logo_url: null,
  website_url: 'https://react.dev',
  github_url: 'https://github.com/facebook/react',
  npm_package: 'react',
  github_stars: 228000,
  npm_weekly_downloads: 25000000,
  pros: ['Massive ecosystem', 'Strong job market', 'Flexible architecture', 'React Native for mobile'],
  cons: ['JSX learning curve', 'Frequent ecosystem changes', 'Boilerplate for state management'],
  best_for: ['Large-scale SPAs', 'Cross-platform development', 'Teams with existing React experience'],
  learning_curve: 'intermediate',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const vuejs: Technology = {
  id: '2',
  name: 'Vue.js',
  slug: 'vuejs',
  category: 'frontend-framework',
  description: 'A progressive JavaScript framework for building user interfaces. Designed to be incrementally adoptable from a simple script tag to a full SPA.',
  logo_url: null,
  website_url: 'https://vuejs.org',
  github_url: 'https://github.com/vuejs/core',
  npm_package: 'vue',
  github_stars: 210000,
  npm_weekly_downloads: 5000000,
  pros: ['Gentle learning curve', 'Excellent documentation', 'Single-file components', 'Flexible integration'],
  cons: ['Smaller job market than React', 'Fewer large-company adoptions', 'Breaking changes between v2 and v3'],
  best_for: ['Small to medium projects', 'Developers new to frameworks', 'Incremental adoption into existing apps'],
  learning_curve: 'beginner',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const svelte: Technology = {
  id: '3',
  name: 'Svelte',
  slug: 'svelte',
  category: 'frontend-framework',
  description: 'A compiler-based framework that shifts work to build time. Svelte compiles components to efficient vanilla JavaScript with no virtual DOM overhead.',
  logo_url: null,
  website_url: 'https://svelte.dev',
  github_url: 'https://github.com/sveltejs/svelte',
  npm_package: 'svelte',
  github_stars: 80000,
  npm_weekly_downloads: 1200000,
  pros: ['No virtual DOM overhead', 'Minimal boilerplate', 'Small bundle sizes', 'Built-in transitions'],
  cons: ['Smaller ecosystem', 'Fewer job opportunities', 'Less mature tooling'],
  best_for: ['Performance-critical apps', 'Small to medium projects', 'Developers who prefer minimal abstraction'],
  learning_curve: 'beginner',
  community_size: 'medium',
  maturity: 'growing',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const nextjs: Technology = {
  id: '4',
  name: 'Next.js',
  slug: 'nextjs',
  category: 'frontend-framework',
  description: 'The React framework for the web. Next.js provides server-side rendering, static site generation, file-based routing, and a full-stack API layer.',
  logo_url: null,
  website_url: 'https://nextjs.org',
  github_url: 'https://github.com/vercel/next.js',
  npm_package: 'next',
  github_stars: 125000,
  npm_weekly_downloads: 8000000,
  pros: ['SSR and SSG out of the box', 'File-based routing', 'Full-stack capabilities', 'Vercel deployment integration'],
  cons: ['Opinionated structure', 'Vendor lock-in risk with Vercel', 'Complex caching model in App Router'],
  best_for: ['Production web apps', 'SEO-critical sites', 'Full-stack TypeScript projects'],
  learning_curve: 'intermediate',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const FIXTURE_TECHNOLOGIES: Technology[] = [react, vuejs, svelte, nextjs];

export const FIXTURE_TECHNOLOGIES_BY_SLUG: Record<string, Technology> = Object.fromEntries(
  FIXTURE_TECHNOLOGIES.map((t) => [t.slug, t])
);
