'use client';

import { useState } from 'react';
import { useWizard } from './WizardProvider';

export function WizardProjectInfo() {
  const { handleSetProjectInfo } = useWizard();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    handleSetProjectInfo(name.trim(), description.trim());
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Plan your project</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Give your project a name and a short description. You&apos;ll then choose a technology
          stack step by step.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-name" className="text-sm font-medium text-zinc-700">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My SaaS App"
            maxLength={100}
            required
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-description" className="text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of what your project does..."
            maxLength={500}
            rows={3}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 resize-none"
          />
          <p className="text-xs text-zinc-400 text-right">{description.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={[
            'self-end rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
            name.trim()
              ? 'bg-zinc-900 text-white hover:bg-zinc-700'
              : 'bg-zinc-100 text-zinc-400 cursor-default',
          ].join(' ')}
        >
          Start planning
        </button>
      </form>
    </div>
  );
}
