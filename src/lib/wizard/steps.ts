import type { WizardStep, WizardStepId } from '@/types/wizard';
import { WIZARD_STEP_ID } from '@/types/wizard';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: WIZARD_STEP_ID.projectType,
    title: 'Project Type',
    description: 'What kind of project are you building?',
    selectionKey: 'projectType',
    options: [
      {
        value: 'web-app',
        name: 'Web Application',
        description: 'A browser-based application accessible via URL',
        pros: ['Wide reach', 'No installation required', 'Easy updates'],
        cons: ['Requires internet', 'Limited device access'],
      },
      {
        value: 'api-service',
        name: 'API Service',
        description: 'A backend service exposing HTTP endpoints',
        pros: ['Reusable', 'Language-agnostic clients', 'Scales independently'],
        cons: ['No built-in UI', 'API versioning complexity'],
      },
      {
        value: 'mobile-app',
        name: 'Mobile App',
        description: 'A native or cross-platform mobile application',
        pros: ['Device access', 'Offline capability', 'App store distribution'],
        cons: ['Platform-specific builds', 'App store approval process'],
      },
      {
        value: 'static-site',
        name: 'Static Site',
        description: 'Pre-rendered HTML/CSS/JS pages',
        pros: ['Fast load times', 'Cheap hosting', 'Inherently secure'],
        cons: ['Limited dynamic content', 'Build time for large sites'],
      },
      {
        value: 'cli-tool',
        name: 'CLI Tool',
        description: 'A command-line utility for developers',
        pros: ['Scriptable', 'Developer-friendly', 'Low overhead'],
        cons: ['No visual UI', 'Steeper learning curve for non-technical users'],
      },
      {
        value: 'monorepo',
        name: 'Monorepo',
        description: 'Multiple packages managed in a single repository',
        pros: ['Shared code', 'Consistent tooling', 'Atomic commits across packages'],
        cons: ['Complex tooling setup', 'Longer CI times'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.architecture,
    title: 'Architecture',
    description: 'How should your system be structured?',
    selectionKey: 'architecture',
    options: [
      {
        value: 'monolith',
        name: 'Monolith',
        description: 'Single deployable unit containing all functionality',
        pros: ['Simple deployment', 'Easy debugging', 'Lower inter-service latency'],
        cons: ['Harder to scale independently', 'Technology lock-in'],
      },
      {
        value: 'microservices',
        name: 'Microservices',
        description: 'Independent services communicating via APIs',
        pros: ['Independent scaling', 'Technology diversity', 'Fault isolation'],
        cons: ['Operational complexity', 'Network overhead', 'Distributed tracing required'],
      },
      {
        value: 'serverless',
        name: 'Serverless',
        description: 'Functions as a service, automatically scaled',
        pros: ['Pay per use', 'Auto-scaling', 'No server management'],
        cons: ['Cold starts', 'Vendor lock-in', 'Limited execution time'],
      },
      {
        value: 'jamstack',
        name: 'JAMstack',
        description: 'JavaScript, APIs, and pre-rendered Markup served from a CDN',
        pros: ['Fast static delivery', 'Great developer experience', 'CDN-first architecture'],
        cons: ['Dynamic features require external APIs', 'Build times increase with scale'],
      },
      {
        value: 'modular-monolith',
        name: 'Modular Monolith',
        description: 'Single deployment with enforced module boundaries',
        pros: ['Simple operations', 'Refactorable to microservices', 'Enforced boundaries'],
        cons: ['Still shares a database', 'Requires strict discipline'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.frontend,
    title: 'Frontend Framework',
    description: 'Which frontend framework will power your UI?',
    selectionKey: 'frontend',
    options: [
      {
        value: 'Next.js',
        name: 'Next.js',
        description: 'React framework with SSR, App Router, and full-stack capabilities',
        pros: ['Full-stack in one repo', 'Great DX', 'SEO-friendly', 'Optimized for Vercel'],
        cons: ['Complex caching model', 'Rapid API changes'],
      },
      {
        value: 'React',
        name: 'React',
        description: 'UI library for building component-based interfaces',
        pros: ['Huge ecosystem', 'Flexible', 'Strong community', 'Many job postings'],
        cons: ['Just a view library — need to assemble own stack', 'Boilerplate for routing/state'],
      },
      {
        value: 'Vue',
        name: 'Vue',
        description: 'Progressive JavaScript framework with Composition API',
        pros: ['Gentle learning curve', 'Clear conventions', 'Composition API'],
        cons: ['Smaller ecosystem than React', 'Fewer enterprise users'],
      },
      {
        value: 'SvelteKit',
        name: 'SvelteKit',
        description: 'Full-stack Svelte framework with file-based routing',
        pros: ['Compiled — no virtual DOM', 'Less boilerplate', 'Built-in transitions'],
        cons: ['Smaller ecosystem', 'Fewer job postings than React/Vue'],
      },
      {
        value: 'Nuxt',
        name: 'Nuxt',
        description: 'Full-stack Vue framework with auto-imports and SSR',
        pros: ['Auto-imports', 'SSR out of the box', 'Great DX for Vue devs'],
        cons: ['Vue ecosystem constraints', 'Configuration complexity'],
      },
      {
        value: 'Angular',
        name: 'Angular',
        description: 'Full opinionated framework by Google with strong typing',
        pros: ['Enterprise-ready', 'Strong TypeScript integration', 'Opinionated structure'],
        cons: ['Steep learning curve', 'Verbose', 'Heavy bundle size'],
      },
      {
        value: 'Astro',
        name: 'Astro',
        description: 'Content-focused framework with islands architecture',
        pros: ['Zero JS by default', 'Use any framework for islands', 'Very fast'],
        cons: ['Less suitable for SPAs', 'Smaller community'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No frontend — API-only or CLI project',
        pros: ['Lightweight', 'No UI overhead'],
        cons: ['No visual interface for end users'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.styling,
    title: 'Styling',
    description: 'How will you style your frontend?',
    selectionKey: 'styling',
    options: [
      {
        value: 'Tailwind CSS',
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework',
        pros: ['Rapid development', 'Consistent design tokens', 'Tiny production bundles'],
        cons: ['Class verbosity in markup', 'Learning curve for the utility-first approach'],
      },
      {
        value: 'CSS Modules',
        name: 'CSS Modules',
        description: 'Scoped CSS per component, no global leaks',
        pros: ['No class name conflicts', 'Standard CSS syntax', 'Lightweight'],
        cons: ['No utility classes', 'More files to maintain'],
      },
      {
        value: 'Styled Components',
        name: 'Styled Components',
        description: 'CSS-in-JS with component-scoped styles and theming',
        pros: ['Dynamic styles via props', 'No class conflicts', 'Built-in theming'],
        cons: ['Runtime overhead', 'SSR configuration complexity'],
      },
      {
        value: 'Sass',
        name: 'Sass',
        description: 'CSS preprocessor with variables, nesting, and mixins',
        pros: ['Powerful features', 'Widely understood', 'No JavaScript required'],
        cons: ['Extra build step', 'Global scope issues without BEM/modules'],
      },
      {
        value: 'Vanilla CSS',
        name: 'Vanilla CSS',
        description: 'Plain CSS with custom properties',
        pros: ['Zero dependencies', 'Standard browser support', 'No build step'],
        cons: ['Manual organization at scale', 'Lacks utility classes'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No dedicated styling layer',
        pros: ['Zero overhead'],
        cons: ['Harder to maintain visual consistency'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.backend,
    title: 'Backend',
    description: 'What will power your server-side logic?',
    selectionKey: 'backend',
    options: [
      {
        value: 'Node.js',
        name: 'Node.js',
        description: 'JavaScript runtime for server-side code',
        pros: ['Same language as frontend', 'Large ecosystem', 'Fast I/O'],
        cons: ['Single-threaded event loop', 'Callback complexity without async/await'],
      },
      {
        value: 'Express',
        name: 'Express',
        description: 'Minimal and flexible Node.js web framework',
        pros: ['Minimal', 'Highly flexible', 'Massive ecosystem of middleware'],
        cons: ['No opinions — manual setup for everything', 'Verbose error handling'],
      },
      {
        value: 'Fastify',
        name: 'Fastify',
        description: 'Fast and low-overhead Node.js web framework',
        pros: ['Very fast', 'Schema-based validation built in', 'TypeScript-first'],
        cons: ['Smaller ecosystem than Express', 'Less middleware available'],
      },
      {
        value: 'Django',
        name: 'Django',
        description: 'Full-featured Python web framework',
        pros: ['Batteries included', 'Built-in ORM', 'Admin panel out of the box'],
        cons: ['Python required', 'Opinionated structure', 'Slower than Node for I/O'],
      },
      {
        value: 'Flask',
        name: 'Flask',
        description: 'Minimal Python web framework',
        pros: ['Lightweight', 'Flexible', 'Easy to start'],
        cons: ['Need to add routing, ORM, auth manually', 'Python required'],
      },
      {
        value: 'Rails',
        name: 'Rails',
        description: 'Full-featured Ruby web framework',
        pros: ['Convention over configuration', 'Fast prototyping', 'Rich ecosystem'],
        cons: ['Ruby syntax', 'Performance under very heavy load'],
      },
      {
        value: 'Go',
        name: 'Go',
        description: 'Compiled systems language ideal for high-performance backends',
        pros: ['Very fast', 'Low memory usage', 'Excellent concurrency'],
        cons: ['Verbose error handling', 'Smaller web framework ecosystem'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No dedicated backend — static site or serverless functions only',
        pros: ['Simpler architecture', 'No server to maintain'],
        cons: ['No server-side logic', 'Limited to BaaS providers'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.database,
    title: 'Database',
    description: 'Where will your application store data?',
    selectionKey: 'database',
    options: [
      {
        value: 'PostgreSQL',
        name: 'PostgreSQL',
        description: 'Advanced open-source relational database',
        pros: ['ACID compliant', 'JSONB support', 'Powerful extensions', 'Highly reliable'],
        cons: ['Operational overhead for self-hosting', 'Vertical scaling by default'],
      },
      {
        value: 'MySQL',
        name: 'MySQL',
        description: 'Popular open-source relational database',
        pros: ['Widely supported', 'Good read performance', 'Familiar to most devs'],
        cons: ['Fewer advanced features than PostgreSQL', 'Less flexible JSON support'],
      },
      {
        value: 'MongoDB',
        name: 'MongoDB',
        description: 'Document-oriented NoSQL database',
        pros: ['Flexible schema', 'JSON-native storage', 'Horizontal scaling'],
        cons: ['No ACID transactions by default', 'Aggregations can be complex'],
      },
      {
        value: 'SQLite',
        name: 'SQLite',
        description: 'Lightweight embedded database stored in a single file',
        pros: ['Zero setup', 'File-based', 'Great for local development and testing'],
        cons: ['Not suitable for multi-writer production', 'Limited concurrency'],
      },
      {
        value: 'Redis',
        name: 'Redis',
        description: 'In-memory data structure store for caching and pub/sub',
        pros: ['Extremely fast', 'Pub/sub support', 'Built-in caching primitives'],
        cons: ['Not a primary database', 'Memory-based data is volatile without persistence'],
      },
      {
        value: 'Supabase',
        name: 'Supabase',
        description: 'Managed PostgreSQL with auth, storage, and realtime built in',
        pros: ['Managed Postgres', 'Built-in auth and RLS', 'Realtime subscriptions', 'Free tier'],
        cons: ['Vendor dependency', 'Limited regions on free tier'],
      },
      {
        value: 'PlanetScale',
        name: 'PlanetScale',
        description: 'Serverless MySQL with schema branching',
        pros: ['Schema branching', 'Serverless scaling', 'Non-blocking schema changes'],
        cons: ['No foreign key constraints', 'MySQL only'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No database — stateless or file-based storage',
        pros: ['Simple architecture', 'No DB to maintain'],
        cons: ['No structured persistence', 'Limited to stateless use cases'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.auth,
    title: 'Auth Strategy',
    description: 'How will users authenticate with your application?',
    selectionKey: 'auth',
    options: [
      {
        value: 'Supabase Auth',
        name: 'Supabase Auth',
        description: 'Auth built into Supabase with JWT and OAuth',
        pros: ['Integrated with Supabase DB', 'Many OAuth providers', 'Row Level Security support'],
        cons: ['Supabase vendor dependency'],
      },
      {
        value: 'NextAuth.js',
        name: 'NextAuth.js',
        description: 'Authentication library for Next.js with many providers',
        pros: ['Many OAuth providers', 'Session-based or JWT', 'Open source'],
        cons: ['Complex configuration', 'v4/v5 breaking changes'],
      },
      {
        value: 'Clerk',
        name: 'Clerk',
        description: 'Auth SaaS with pre-built embeddable UI',
        pros: ['Beautiful pre-built components', 'Easy setup', 'Multi-factor auth', 'Organizations support'],
        cons: ['Paid for production scale', 'SaaS dependency'],
      },
      {
        value: 'Auth0',
        name: 'Auth0',
        description: 'Enterprise identity platform with compliance features',
        pros: ['Enterprise-grade features', 'Many identity providers', 'SOC 2 compliant'],
        cons: ['Expensive at scale', 'Over-engineered for small projects'],
      },
      {
        value: 'Firebase Auth',
        name: 'Firebase Auth',
        description: "Google's auth platform integrated with Firebase ecosystem",
        pros: ['Easy setup', 'Google/social login', 'Generous free tier'],
        cons: ['Firebase vendor lock-in', 'Limited customization'],
      },
      {
        value: 'Custom JWT',
        name: 'Custom JWT',
        description: 'Roll your own auth with JSON Web Tokens',
        pros: ['Full control', 'No vendor dependency', 'Fully customizable'],
        cons: ['Full security responsibility', 'Complex to implement correctly'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No authentication — fully public application',
        pros: ['Simpler architecture', 'No user management overhead'],
        cons: ['No personalization', 'No data isolation per user'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.hosting,
    title: 'Hosting',
    description: 'Where will you deploy your application?',
    selectionKey: 'hosting',
    options: [
      {
        value: 'Vercel',
        name: 'Vercel',
        description: 'Platform optimized for frontend and serverless functions',
        pros: ['Zero-config Next.js deploys', 'Global CDN', 'Preview deployments per PR', 'Free tier'],
        cons: ['Pricing scales quickly', 'Close coupling with Next.js'],
      },
      {
        value: 'Netlify',
        name: 'Netlify',
        description: 'Platform for static sites and serverless functions',
        pros: ['Easy setup', 'Built-in forms handling', 'Split testing'],
        cons: ['Less optimized for Next.js than Vercel', 'Functions have cold starts'],
      },
      {
        value: 'AWS',
        name: 'AWS',
        description: 'Amazon Web Services — EC2, Lambda, S3, CloudFront',
        pros: ['Massive feature set', 'Enterprise-grade SLAs', 'Global regions'],
        cons: ['High complexity', 'Pricing surprises', 'Steep learning curve'],
      },
      {
        value: 'Railway',
        name: 'Railway',
        description: 'Simple cloud platform for apps and managed databases',
        pros: ['Simple predictable pricing', 'Docker support', 'Databases included'],
        cons: ['Smaller ecosystem', 'Fewer global regions than AWS'],
      },
      {
        value: 'Fly.io',
        name: 'Fly.io',
        description: 'Platform for running containers close to your users globally',
        pros: ['Global low-latency deployment', 'Docker-first', 'Persistent volumes'],
        cons: ['More ops knowledge required than Vercel', 'Paid after small free tier'],
      },
      {
        value: 'DigitalOcean',
        name: 'DigitalOcean',
        description: 'Developer-friendly cloud with App Platform',
        pros: ['Predictable pricing', 'Simple UI', 'App Platform for easy deploys'],
        cons: ['Less feature-rich than AWS', 'Fewer managed services'],
      },
      {
        value: 'Cloudflare Pages',
        name: 'Cloudflare Pages',
        description: 'Edge-first deployment with global CDN and Workers',
        pros: ['Global edge network', 'Workers integration', 'Generous free tier'],
        cons: ['Edge runtime limitations', 'Some Node.js APIs unavailable'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.cicd,
    title: 'CI/CD',
    description: 'How will you automate testing and deployment?',
    selectionKey: 'cicd',
    options: [
      {
        value: 'GitHub Actions',
        name: 'GitHub Actions',
        description: 'CI/CD workflows built into GitHub',
        pros: ['Native GitHub integration', 'Large marketplace of actions', 'Generous free tier'],
        cons: ['Slower runners than some alternatives', 'YAML complexity at scale'],
      },
      {
        value: 'GitLab CI',
        name: 'GitLab CI',
        description: 'CI/CD built into GitLab as part of its all-in-one DevOps platform',
        pros: ['All-in-one DevOps platform', 'Self-hosted option', 'Strong pipeline features'],
        cons: ['Requires using GitLab', 'Resource-intensive to self-host'],
      },
      {
        value: 'CircleCI',
        name: 'CircleCI',
        description: 'Dedicated CI/CD platform with fast parallel execution',
        pros: ['Fast builds', 'Easy parallelism', 'Docker-first'],
        cons: ['Paid for higher parallelism', 'External to your git host'],
      },
      {
        value: 'Jenkins',
        name: 'Jenkins',
        description: 'Open-source automation server with a huge plugin ecosystem',
        pros: ['Self-hosted control', 'Highly configurable', 'Massive plugin ecosystem'],
        cons: ['Heavy operational overhead', 'Old XML-based config', 'Complex setup'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No CI/CD pipeline — manual deployment',
        pros: ['No setup required'],
        cons: ['Manual deployments', 'No automated test gating', 'Regression risk'],
      },
    ],
  },
  {
    id: WIZARD_STEP_ID.testing,
    title: 'Testing',
    description: 'How will you verify your application works correctly?',
    selectionKey: 'testing',
    options: [
      {
        value: 'Vitest',
        name: 'Vitest',
        description: 'Fast unit testing with native ESM support powered by Vite',
        pros: ['Very fast', 'Vite-compatible', 'Jest-compatible API', 'Built-in coverage'],
        cons: ['Newer with a smaller community than Jest'],
      },
      {
        value: 'Jest',
        name: 'Jest',
        description: 'Popular JavaScript testing framework with snapshot support',
        pros: ['Large ecosystem', 'Snapshot testing', 'Wide adoption and resources'],
        cons: ['Slower than Vitest', 'ESM configuration complexity'],
      },
      {
        value: 'Playwright',
        name: 'Playwright',
        description: 'E2E browser automation with cross-browser support',
        pros: ['Cross-browser testing', 'Reliable flake-resistant tests', 'Network interception'],
        cons: ['E2E tests are slow', 'Requires browser binaries'],
      },
      {
        value: 'Cypress',
        name: 'Cypress',
        description: 'E2E and component testing with time-travel debugging',
        pros: ['Great developer experience', 'Time-travel debugging', 'Component testing'],
        cons: ['Chrome-first', 'Parallelism requires paid plan'],
      },
      {
        value: 'None',
        name: 'None',
        description: 'No automated tests',
        pros: ['Faster initial development'],
        cons: ['Manual testing only', 'High regression risk', 'No safety net for refactors'],
      },
    ],
  },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;

export function getStepById(id: WizardStepId): WizardStep | undefined {
  return WIZARD_STEPS.find((s) => s.id === id);
}

export function getStepByIndex(index: number): WizardStep | undefined {
  if (index < 0 || index >= WIZARD_STEPS.length) return undefined;
  return WIZARD_STEPS[index];
}

export function getNextStep(currentId: WizardStepId): WizardStep | undefined {
  const index = WIZARD_STEPS.findIndex((s) => s.id === currentId);
  if (index === -1 || index === WIZARD_STEPS.length - 1) return undefined;
  return WIZARD_STEPS[index + 1];
}

export function getPreviousStep(currentId: WizardStepId): WizardStep | undefined {
  const index = WIZARD_STEPS.findIndex((s) => s.id === currentId);
  if (index <= 0) return undefined;
  return WIZARD_STEPS[index - 1];
}
