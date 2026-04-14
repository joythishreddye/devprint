export interface WizardOption {
  value: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface WizardStep {
  id: WizardStepId;
  title: string;
  description: string;
  selectionKey: keyof WizardSelections;
  options: WizardOption[];
}

export const WIZARD_STEP_ID = {
  projectType: 'projectType',
  architecture: 'architecture',
  frontend: 'frontend',
  styling: 'styling',
  backend: 'backend',
  database: 'database',
  auth: 'auth',
  hosting: 'hosting',
  cicd: 'cicd',
  testing: 'testing',
} as const;

export type WizardStepId = typeof WIZARD_STEP_ID[keyof typeof WIZARD_STEP_ID];

export interface WizardSelections {
  projectName: string;
  description: string;
  projectType: string | null;
  architecture: string | null;
  frontend: string | null;
  styling: string | null;
  backend: string | null;
  database: string | null;
  auth: string | null;
  hosting: string | null;
  cicd: string | null;
  testing: string | null;
}

export const WIZARD_PHASE = {
  info: 'info',
  steps: 'steps',
  summary: 'summary',
} as const;

export type WizardPhase = typeof WIZARD_PHASE[keyof typeof WIZARD_PHASE];

export interface WizardState {
  phase: WizardPhase;
  currentStepIndex: number;
  selections: WizardSelections;
}
