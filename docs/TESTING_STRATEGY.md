# Testing Strategy

| Type | Location | What to Test | Tool |
|------|----------|-------------|------|
| Unit | `src/lib/**/__tests__/` | Pure utility functions — comparison engine, generators, validators | Vitest |
| Component | `src/components/**/__tests__/` | Interactive UI components with user events | Vitest + Testing Library |
| E2E | `e2e/` | Critical user flows (auth, wizard, compare, generate config) | Playwright |

## Coverage Targets
- **Lines**: >80%
- **Branches**: >70%
- **Functions**: >80%

## TDD Workflow (for `src/lib/`)
Strict red-green-refactor with separate commits at each step:
1. **RED**: Write failing test → commit `test: add failing tests for <feature>`
2. **GREEN**: Minimal implementation → commit `feat: implement <feature>`
3. **REFACTOR**: Improve code, tests stay green → commit `refactor: <improvement>`

## Running Tests
```bash
npm run test              # Run all unit tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:e2e          # Playwright E2E tests
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint
```
