// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { mapWizardToProjectSelections } from '../mapper';
import { WIZARD_PHASE } from '@/types/wizard';
import type { WizardState } from '@/types/wizard';

function makeState(overrides: Partial<WizardState['selections']> = {}): WizardState {
  return {
    phase: WIZARD_PHASE.steps,
    currentStepIndex: 0,
    selections: {
      projectName: 'Test Project',
      description: 'A test project',
      projectType: null,
      architecture: null,
      frontend: null,
      styling: null,
      backend: null,
      database: null,
      auth: null,
      hosting: null,
      cicd: null,
      testing: null,
      ...overrides,
    },
  };
}

describe('mapWizardToProjectSelections', () => {
  it('passes projectName through unchanged', () => {
    const state = makeState({ projectName: 'My App' });
    expect(mapWizardToProjectSelections(state).projectName).toBe('My App');
  });

  it('passes description through unchanged', () => {
    const state = makeState({ description: 'My description' });
    expect(mapWizardToProjectSelections(state).description).toBe('My description');
  });

  it('maps frontend directly', () => {
    const state = makeState({ frontend: 'Next.js' });
    expect(mapWizardToProjectSelections(state).frontend).toBe('Next.js');
  });

  it('maps styling directly', () => {
    const state = makeState({ styling: 'Tailwind CSS' });
    expect(mapWizardToProjectSelections(state).styling).toBe('Tailwind CSS');
  });

  it('maps backend directly', () => {
    const state = makeState({ backend: 'Node.js' });
    expect(mapWizardToProjectSelections(state).backend).toBe('Node.js');
  });

  it('maps database directly', () => {
    const state = makeState({ database: 'PostgreSQL' });
    expect(mapWizardToProjectSelections(state).database).toBe('PostgreSQL');
  });

  it('maps testing directly', () => {
    const state = makeState({ testing: 'Vitest' });
    expect(mapWizardToProjectSelections(state).testing).toBe('Vitest');
  });

  it('maps hosting to deployment', () => {
    const state = makeState({ hosting: 'Vercel' });
    expect(mapWizardToProjectSelections(state).deployment).toBe('Vercel');
  });

  it('maps "None" frontend to null', () => {
    const state = makeState({ frontend: 'None' });
    expect(mapWizardToProjectSelections(state).frontend).toBeNull();
  });

  it('maps "None" styling to null', () => {
    const state = makeState({ styling: 'None' });
    expect(mapWizardToProjectSelections(state).styling).toBeNull();
  });

  it('maps "None" backend to null', () => {
    const state = makeState({ backend: 'None' });
    expect(mapWizardToProjectSelections(state).backend).toBeNull();
  });

  it('maps "None" database to null', () => {
    const state = makeState({ database: 'None' });
    expect(mapWizardToProjectSelections(state).database).toBeNull();
  });

  it('maps "None" testing to null', () => {
    const state = makeState({ testing: 'None' });
    expect(mapWizardToProjectSelections(state).testing).toBeNull();
  });

  it('maps null selections to null', () => {
    const state = makeState();
    const result = mapWizardToProjectSelections(state);
    expect(result.frontend).toBeNull();
    expect(result.backend).toBeNull();
    expect(result.database).toBeNull();
    expect(result.styling).toBeNull();
    expect(result.testing).toBeNull();
    expect(result.deployment).toBeNull();
  });

  it('produces a complete ProjectSelections shape', () => {
    const state = makeState({
      projectName: 'Full App',
      description: 'Full description',
      frontend: 'React',
      styling: 'Tailwind CSS',
      backend: 'Node.js',
      database: 'PostgreSQL',
      testing: 'Vitest',
      hosting: 'Vercel',
    });
    const result = mapWizardToProjectSelections(state);
    expect(result).toMatchObject({
      projectName: 'Full App',
      description: 'Full description',
      frontend: 'React',
      styling: 'Tailwind CSS',
      backend: 'Node.js',
      database: 'PostgreSQL',
      testing: 'Vitest',
      deployment: 'Vercel',
    });
  });
});
