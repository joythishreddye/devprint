import type { Metadata } from 'next';
import { WizardProvider } from '@/components/wizard/WizardProvider';
import { WizardShell } from '@/components/wizard/WizardShell';

export const metadata: Metadata = {
  title: 'Project Wizard — DevPrint',
  description: 'Plan your project stack step by step and generate AI tool config files.',
};

export default function WizardPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}
