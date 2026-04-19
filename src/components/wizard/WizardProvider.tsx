'use client';

import { createContext, useContext, useReducer } from 'react';
import type { WizardState, WizardStepId, WizardSelections } from '@/types/wizard';
import { WIZARD_PHASE } from '@/types/wizard';
import {
  createInitialState,
  setProjectInfo,
  setSelection,
  goToStep,
  goToNextStep,
  goToPreviousStep,
} from '@/lib/wizard/state';

interface WizardContextValue {
  state: WizardState;
  planId: string | null;
  handleSetProjectInfo: (name: string, description: string) => void;
  handleSetSelection: (stepId: WizardStepId, value: string) => void;
  handleGoToStep: (index: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

type WizardAction =
  | { type: 'SET_PROJECT_INFO'; name: string; description: string }
  | { type: 'SET_SELECTION'; stepId: WizardStepId; value: string }
  | { type: 'GO_TO_STEP'; index: number }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PROJECT_INFO':
      return setProjectInfo(state, action.name, action.description);
    case 'SET_SELECTION':
      return setSelection(state, action.stepId, action.value);
    case 'GO_TO_STEP':
      return goToStep(state, action.index);
    case 'NEXT':
      return goToNextStep(state);
    case 'BACK':
      return goToPreviousStep(state);
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

export interface WizardProviderProps {
  children: React.ReactNode;
  initialSelections?: WizardSelections;
  planId?: string | null;
}

export function WizardProvider({ children, initialSelections, planId = null }: WizardProviderProps) {
  const [state, dispatch] = useReducer(
    wizardReducer,
    undefined,
    () =>
      initialSelections
        ? { phase: WIZARD_PHASE.summary, currentStepIndex: 0, selections: initialSelections }
        : createInitialState(),
  );

  const value: WizardContextValue = {
    state,
    planId: planId ?? null,
    handleSetProjectInfo: (name, description) =>
      dispatch({ type: 'SET_PROJECT_INFO', name, description }),
    handleSetSelection: (stepId, value) =>
      dispatch({ type: 'SET_SELECTION', stepId, value }),
    handleGoToStep: (index) => dispatch({ type: 'GO_TO_STEP', index }),
    handleNext: () => dispatch({ type: 'NEXT' }),
    handleBack: () => dispatch({ type: 'BACK' }),
    handleReset: () => dispatch({ type: 'RESET' }),
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider');
  return ctx;
}
