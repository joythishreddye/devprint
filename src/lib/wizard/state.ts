import type { WizardState, WizardSelections, WizardStepId } from '@/types/wizard';
import { WIZARD_PHASE, WIZARD_STEP_ID } from '@/types/wizard';
import { TOTAL_STEPS, WIZARD_STEPS } from './steps';

const STEP_ID_TO_SELECTION_KEY: Record<WizardStepId, keyof WizardSelections> = {
  [WIZARD_STEP_ID.projectType]: 'projectType',
  [WIZARD_STEP_ID.architecture]: 'architecture',
  [WIZARD_STEP_ID.frontend]: 'frontend',
  [WIZARD_STEP_ID.styling]: 'styling',
  [WIZARD_STEP_ID.backend]: 'backend',
  [WIZARD_STEP_ID.database]: 'database',
  [WIZARD_STEP_ID.auth]: 'auth',
  [WIZARD_STEP_ID.hosting]: 'hosting',
  [WIZARD_STEP_ID.cicd]: 'cicd',
  [WIZARD_STEP_ID.testing]: 'testing',
};

function emptySelections(): WizardSelections {
  return {
    projectName: '',
    description: '',
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
  };
}

export function createInitialState(): WizardState {
  return {
    phase: WIZARD_PHASE.info,
    currentStepIndex: 0,
    selections: emptySelections(),
  };
}

export function setProjectInfo(
  state: WizardState,
  projectName: string,
  description: string,
): WizardState {
  return {
    ...state,
    phase: WIZARD_PHASE.steps,
    selections: { ...state.selections, projectName, description },
  };
}

export function setSelection(
  state: WizardState,
  stepId: WizardStepId,
  value: string,
): WizardState {
  const key = STEP_ID_TO_SELECTION_KEY[stepId];
  return {
    ...state,
    selections: { ...state.selections, [key]: value },
  };
}

export function goToStep(state: WizardState, index: number): WizardState {
  const clamped = Math.max(0, Math.min(index, TOTAL_STEPS - 1));
  return { ...state, currentStepIndex: clamped };
}

export function goToNextStep(state: WizardState): WizardState {
  if (state.phase === WIZARD_PHASE.steps && state.currentStepIndex >= TOTAL_STEPS - 1) {
    return { ...state, phase: WIZARD_PHASE.summary };
  }
  return { ...state, currentStepIndex: Math.min(state.currentStepIndex + 1, TOTAL_STEPS - 1) };
}

export function goToPreviousStep(state: WizardState): WizardState {
  if (state.phase === WIZARD_PHASE.summary) {
    return { ...state, phase: WIZARD_PHASE.steps };
  }
  return { ...state, currentStepIndex: Math.max(state.currentStepIndex - 1, 0) };
}

export function isStepComplete(state: WizardState, stepId: WizardStepId): boolean {
  const key = STEP_ID_TO_SELECTION_KEY[stepId];
  return state.selections[key] !== null && state.selections[key] !== '';
}

export function canProceed(state: WizardState): boolean {
  const currentStep = WIZARD_STEPS[state.currentStepIndex];
  if (!currentStep) return false;
  return isStepComplete(state, currentStep.id);
}

export function getCompletionPercentage(state: WizardState): number {
  const completed = WIZARD_STEPS.filter((step) => isStepComplete(state, step.id)).length;
  return Math.round((completed / TOTAL_STEPS) * 100);
}
