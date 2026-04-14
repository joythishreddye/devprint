'use client';

import type { WizardOption } from '@/types/wizard';

export interface WizardOptionCardProps {
  option: WizardOption;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function WizardOptionCard({ option, selected, onSelect }: WizardOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={[
        'flex flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-150 w-full',
        selected
          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
          : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:shadow-sm',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm">{option.name}</span>
        {selected && (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M5 8l2.5 2.5L11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <p className={['text-xs leading-relaxed', selected ? 'text-zinc-300' : 'text-zinc-500'].join(' ')}>
        {option.description}
      </p>

      <div className="mt-auto flex flex-col gap-1.5">
        <ul className="flex flex-wrap gap-1">
          {option.pros.map((pro) => (
            <li
              key={pro}
              className={[
                'rounded-full px-2 py-0.5 text-xs',
                selected ? 'bg-white/10 text-zinc-200' : 'bg-emerald-50 text-emerald-700',
              ].join(' ')}
            >
              + {pro}
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1">
          {option.cons.map((con) => (
            <li
              key={con}
              className={[
                'rounded-full px-2 py-0.5 text-xs',
                selected ? 'bg-white/10 text-zinc-300' : 'bg-red-50 text-red-600',
              ].join(' ')}
            >
              - {con}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
