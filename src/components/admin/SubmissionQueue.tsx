'use client';

import { useState, useTransition } from 'react';
import { reviewSubmissionAction } from '@/app/admin/actions';
import type { ContributionWithContributor } from '@/types/admin';

export interface SubmissionQueueProps {
  contributions: ContributionWithContributor[];
}

export function SubmissionQueue({ contributions }: SubmissionQueueProps) {
  if (contributions.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-8 text-center">
        <p className="text-sm text-zinc-500">No pending submissions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {contributions.map((contribution) => (
        <SubmissionCard key={contribution.id} contribution={contribution} />
      ))}
    </div>
  );
}

function SubmissionCard({ contribution }: { contribution: ContributionWithContributor }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const techName =
    typeof contribution.technology_data?.name === 'string'
      ? contribution.technology_data.name
      : 'Untitled';

  function handleAction(action: 'approve' | 'reject') {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set('contributionId', contribution.id);
      formData.set('action', action);
      formData.set('reviewNotes', notes);
      const result = await reviewSubmissionAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        Submission reviewed.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-900">{techName}</p>
          <p className="mt-0.5 text-xs text-zinc-400">
            by {contribution.contributor_display_name} &middot;{' '}
            {new Date(contribution.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors shrink-0"
        >
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {expanded && (
        <pre className="rounded-md bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-700 overflow-auto max-h-64 whitespace-pre-wrap">
          {JSON.stringify(contribution.technology_data, null, 2)}
        </pre>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reviewer notes (optional)"
          rows={2}
          maxLength={500}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleAction('approve')}
            disabled={isPending}
            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Processing…' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => handleAction('reject')}
            disabled={isPending}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Processing…' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
