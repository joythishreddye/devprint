'use client';

import { useState, useTransition } from 'react';
import { deletePlanAction } from '@/app/dashboard/actions';

export interface DeletePlanButtonProps {
  planId: string;
  planName: string;
}

export function DeletePlanButton({ planId, planName }: DeletePlanButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeleteClick(e: React.MouseEvent) {
    e.preventDefault();
    setConfirming(true);
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    setConfirming(false);
  }

  function handleConfirm(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      await deletePlanAction(planId);
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 shrink-0">Delete &ldquo;{planName}&rdquo;?</span>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="rounded px-2 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Deleting…' : 'Delete'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDeleteClick}
      className="text-xs text-zinc-400 hover:text-red-600 transition-colors"
      aria-label={`Delete plan ${planName}`}
    >
      Delete
    </button>
  );
}
