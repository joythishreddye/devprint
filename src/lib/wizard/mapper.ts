import type { ProjectSelections } from '@/types/generators';
import type { WizardState } from '@/types/wizard';

function noneToNull(value: string | null): string | null {
  if (value === null || value === 'None') return null;
  return value;
}

export function mapWizardToProjectSelections(state: WizardState): ProjectSelections {
  const { selections } = state;
  return {
    projectName: selections.projectName,
    description: selections.description,
    frontend: noneToNull(selections.frontend),
    styling: noneToNull(selections.styling),
    backend: noneToNull(selections.backend),
    database: noneToNull(selections.database),
    testing: noneToNull(selections.testing),
    deployment: noneToNull(selections.hosting),
  };
}
