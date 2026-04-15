import { WizardProvider } from '@/components/wizard/WizardProvider';

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <div className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </WizardProvider>
  );
}
