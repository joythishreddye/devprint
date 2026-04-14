'use client';

import { useState } from 'react';

export interface AdminTabsProps {
  tabs: ReadonlyArray<{ label: string; content: React.ReactNode }>;
}

export function AdminTabs({ tabs }: AdminTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 border-b border-zinc-200">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              i === activeIndex
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeIndex]?.content}</div>
    </div>
  );
}
