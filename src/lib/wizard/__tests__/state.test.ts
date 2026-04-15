// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  setSelection,
  setProjectInfo,
  goToStep,
  goToNextStep,
  goToPreviousStep,
  isStepComplete,
  canProceed,
  getCompletionPercentage,
} from '../state';
import { WIZARD_STEP_ID, WIZARD_PHASE } from '@/types/wizard';
import type { WizardState } from '@/types/wizard';
import { TOTAL_STEPS } from '../steps';

describe('createInitialState', () => {
  it('starts in the info phase', () => {
    expect(createInitialState().phase).toBe(WIZARD_PHASE.info);
  });

  it('starts at step index 0', () => {
    expect(createInitialState().currentStepIndex).toBe(0);
  });

  it('has empty projectName and description', () => {
    const state = createInitialState();
    expect(state.selections.projectName).toBe('');
    expect(state.selections.description).toBe('');
  });

  it('has null for all selection fields', () => {
    const state = createInitialState();
    expect(state.selections.projectType).toBeNull();
    expect(state.selections.architecture).toBeNull();
    expect(state.selections.frontend).toBeNull();
    expect(state.selections.styling).toBeNull();
    expect(state.selections.backend).toBeNull();
    expect(state.selections.database).toBeNull();
    expect(state.selections.auth).toBeNull();
    expect(state.selections.hosting).toBeNull();
    expect(state.selections.cicd).toBeNull();
    expect(state.selections.testing).toBeNull();
  });
});

describe('setProjectInfo', () => {
  it('sets projectName and description', () => {
    const state = createInitialState();
    const next = setProjectInfo(state, 'My App', 'A great app');
    expect(next.selections.projectName).toBe('My App');
    expect(next.selections.description).toBe('A great app');
  });

  it('advances phase to steps', () => {
    const state = createInitialState();
    const next = setProjectInfo(state, 'My App', 'A great app');
    expect(next.phase).toBe(WIZARD_PHASE.steps);
  });

  it('does not mutate the original state', () => {
    const state = createInitialState();
    setProjectInfo(state, 'My App', 'desc');
    expect(state.selections.projectName).toBe('');
  });
});

describe('setSelection', () => {
  it('sets a selection for the given step', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    const next = setSelection(state, WIZARD_STEP_ID.frontend, 'Next.js');
    expect(next.selections.frontend).toBe('Next.js');
  });

  it('does not mutate the original state', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    const original = state.selections.frontend;
    setSelection(state, WIZARD_STEP_ID.frontend, 'Next.js');
    expect(state.selections.frontend).toBe(original);
  });

  it('is idempotent when called twice with the same value', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    const next1 = setSelection(state, WIZARD_STEP_ID.frontend, 'React');
    const next2 = setSelection(next1, WIZARD_STEP_ID.frontend, 'React');
    expect(next2.selections.frontend).toBe('React');
  });

  it('overwrites a previous selection', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    const next1 = setSelection(state, WIZARD_STEP_ID.frontend, 'React');
    const next2 = setSelection(next1, WIZARD_STEP_ID.frontend, 'Vue');
    expect(next2.selections.frontend).toBe('Vue');
  });

  it('preserves other selections when setting one', () => {
    let state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    state = setSelection(state, WIZARD_STEP_ID.backend, 'Node.js');
    const next = setSelection(state, WIZARD_STEP_ID.frontend, 'React');
    expect(next.selections.backend).toBe('Node.js');
  });
});

describe('goToStep', () => {
  it('moves to the given index', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    const next = goToStep(state, 3);
    expect(next.currentStepIndex).toBe(3);
  });

  it('clamps negative index to 0', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    expect(goToStep(state, -1).currentStepIndex).toBe(0);
  });

  it('clamps out-of-bounds index to last step', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    expect(goToStep(state, 999).currentStepIndex).toBe(TOTAL_STEPS - 1);
  });

  it('does not mutate the original state', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 0 };
    goToStep(state, 5);
    expect(state.currentStepIndex).toBe(0);
  });
});

describe('goToNextStep', () => {
  it('increments step index', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 2 };
    expect(goToNextStep(state).currentStepIndex).toBe(3);
  });

  it('advances phase to summary at the last step', () => {
    const state: WizardState = {
      ...createInitialState(),
      phase: WIZARD_PHASE.steps,
      currentStepIndex: TOTAL_STEPS - 1,
    };
    const next = goToNextStep(state);
    expect(next.phase).toBe(WIZARD_PHASE.summary);
  });

  it('does not go beyond last step index', () => {
    const state: WizardState = {
      ...createInitialState(),
      phase: WIZARD_PHASE.steps,
      currentStepIndex: TOTAL_STEPS - 1,
    };
    const next = goToNextStep(state);
    expect(next.currentStepIndex).toBe(TOTAL_STEPS - 1);
  });
});

describe('goToPreviousStep', () => {
  it('decrements step index', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 3 };
    expect(goToPreviousStep(state).currentStepIndex).toBe(2);
  });

  it('does not go below 0', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 0 };
    expect(goToPreviousStep(state).currentStepIndex).toBe(0);
  });

  it('transitions from summary back to last steps step', () => {
    const state: WizardState = {
      ...createInitialState(),
      phase: WIZARD_PHASE.summary,
      currentStepIndex: TOTAL_STEPS - 1,
    };
    const next = goToPreviousStep(state);
    expect(next.phase).toBe(WIZARD_PHASE.steps);
    expect(next.currentStepIndex).toBe(TOTAL_STEPS - 1);
  });
});

describe('isStepComplete', () => {
  it('returns false for an unvisited step', () => {
    const state = createInitialState();
    expect(isStepComplete(state, WIZARD_STEP_ID.frontend)).toBe(false);
  });

  it('returns true after a selection is made', () => {
    let state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    state = setSelection(state, WIZARD_STEP_ID.frontend, 'React');
    expect(isStepComplete(state, WIZARD_STEP_ID.frontend)).toBe(true);
  });
});

describe('canProceed', () => {
  it('returns false when the current step has no selection', () => {
    const state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 0 };
    expect(canProceed(state)).toBe(false);
  });

  it('returns true when the current step has a selection', () => {
    let state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps, currentStepIndex: 0 };
    state = setSelection(state, WIZARD_STEP_ID.projectType, 'web-app');
    expect(canProceed(state)).toBe(true);
  });
});

describe('getCompletionPercentage', () => {
  it('returns 0 for fresh state', () => {
    const state = createInitialState();
    expect(getCompletionPercentage(state)).toBe(0);
  });

  it('returns 100 when all steps have selections', () => {
    let state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    state = setSelection(state, WIZARD_STEP_ID.projectType, 'web-app');
    state = setSelection(state, WIZARD_STEP_ID.architecture, 'monolith');
    state = setSelection(state, WIZARD_STEP_ID.frontend, 'Next.js');
    state = setSelection(state, WIZARD_STEP_ID.styling, 'Tailwind CSS');
    state = setSelection(state, WIZARD_STEP_ID.backend, 'Node.js');
    state = setSelection(state, WIZARD_STEP_ID.database, 'PostgreSQL');
    state = setSelection(state, WIZARD_STEP_ID.auth, 'Supabase Auth');
    state = setSelection(state, WIZARD_STEP_ID.hosting, 'Vercel');
    state = setSelection(state, WIZARD_STEP_ID.cicd, 'GitHub Actions');
    state = setSelection(state, WIZARD_STEP_ID.testing, 'Vitest');
    expect(getCompletionPercentage(state)).toBe(100);
  });

  it('returns 50 when half the steps have selections', () => {
    let state: WizardState = { ...createInitialState(), phase: WIZARD_PHASE.steps };
    state = setSelection(state, WIZARD_STEP_ID.projectType, 'web-app');
    state = setSelection(state, WIZARD_STEP_ID.architecture, 'monolith');
    state = setSelection(state, WIZARD_STEP_ID.frontend, 'Next.js');
    state = setSelection(state, WIZARD_STEP_ID.styling, 'Tailwind CSS');
    state = setSelection(state, WIZARD_STEP_ID.backend, 'Node.js');
    expect(getCompletionPercentage(state)).toBe(50);
  });
});
