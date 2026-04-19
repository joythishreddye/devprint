'use client';

import { useState, useTransition } from 'react';
import { submitContributionAction, editContributionAction } from '@/app/contributor/actions';
import type { TechnologySubmissionInput } from '@/lib/validators/contribution';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

export interface ContributionFormProps {
  initialData?: Partial<TechnologySubmissionInput> | null;
  contributionId?: string | null;
}

type ArrayField = 'pros' | 'cons' | 'best_for';

function toLines(arr: string[] | undefined): string {
  return (arr ?? ['']).join('\n');
}

export function ContributionForm({ initialData, contributionId }: ContributionFormProps) {
  const isEdit = Boolean(contributionId);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [arrayFields, setArrayFields] = useState<Record<ArrayField, string>>({
    pros: toLines(initialData?.pros),
    cons: toLines(initialData?.cons),
    best_for: toLines(initialData?.best_for),
  });

  function handleArrayChange(field: ArrayField, value: string) {
    setArrayFields((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Inject array fields (newline-separated)
    formData.set('pros', arrayFields.pros);
    formData.set('cons', arrayFields.cons);
    formData.set('best_for', arrayFields.best_for);

    startTransition(async () => {
      const result = isEdit && contributionId
        ? await editContributionAction(contributionId, formData)
        : await submitContributionAction(formData);

      if (!result.success) {
        const msg = result.error ?? 'Submission failed. Please try again.';
        setError(msg);
        toast(msg, 'error');
        return;
      }
      toast(
        isEdit ? 'Contribution updated successfully.' : 'Technology submitted for review.',
        'success',
      );
      setSuccess(true);
      if (!isEdit) {
        form.reset();
        setArrayFields({ pros: '', cons: '', best_for: '' });
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-6 text-center">
        <p className="text-sm font-medium text-green-800">
          {isEdit ? 'Contribution updated successfully.' : 'Technology submitted for review.'}
        </p>
        {isEdit && (
          <Link
            href="/contributor"
            className="mt-3 inline-block text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Back to submissions
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            name="name"
            defaultValue={initialData?.name ?? ''}
            maxLength={100}
            required
            className={inputClass}
            placeholder="e.g. Next.js"
          />
        </Field>

        <Field label="Slug" required hint="Lowercase kebab-case, e.g. next-js">
          <input
            name="slug"
            defaultValue={initialData?.slug ?? ''}
            maxLength={100}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers, and hyphens only"
            className={inputClass}
            placeholder="e.g. next-js"
          />
        </Field>

        <Field label="Category" required>
          <input
            name="category"
            defaultValue={initialData?.category ?? ''}
            maxLength={50}
            required
            className={inputClass}
            placeholder="e.g. framework"
          />
        </Field>

        <Field label="Learning curve" required>
          <select
            name="learning_curve"
            defaultValue={initialData?.learning_curve ?? 'intermediate'}
            required
            className={inputClass}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>

        <Field label="Community size" required>
          <select
            name="community_size"
            defaultValue={initialData?.community_size ?? 'medium'}
            required
            className={inputClass}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>

        <Field label="Maturity" required>
          <select
            name="maturity"
            defaultValue={initialData?.maturity ?? 'growing'}
            required
            className={inputClass}
          >
            <option value="emerging">Emerging</option>
            <option value="growing">Growing</option>
            <option value="mature">Mature</option>
            <option value="declining">Declining</option>
          </select>
        </Field>
      </div>

      <Field label="Description" required>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ''}
          maxLength={2000}
          required
          rows={3}
          className={inputClass}
          placeholder="A brief description of the technology (up to 2000 characters)"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Logo URL">
          <input
            name="logo_url"
            defaultValue={initialData?.logo_url ?? ''}
            type="url"
            className={inputClass}
            placeholder="https://..."
          />
        </Field>

        <Field label="Website URL">
          <input
            name="website_url"
            defaultValue={initialData?.website_url ?? ''}
            type="url"
            className={inputClass}
            placeholder="https://..."
          />
        </Field>

        <Field label="GitHub URL">
          <input
            name="github_url"
            defaultValue={initialData?.github_url ?? ''}
            type="url"
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </Field>

        <Field label="npm package">
          <input
            name="npm_package"
            defaultValue={initialData?.npm_package ?? ''}
            className={inputClass}
            placeholder="e.g. next"
          />
        </Field>

        <Field label="GitHub stars">
          <input
            name="github_stars"
            defaultValue={initialData?.github_stars ?? ''}
            type="number"
            min={0}
            step={1}
            className={inputClass}
            placeholder="e.g. 120000"
          />
        </Field>

        <Field label="npm weekly downloads">
          <input
            name="npm_weekly_downloads"
            defaultValue={initialData?.npm_weekly_downloads ?? ''}
            type="number"
            min={0}
            step={1}
            className={inputClass}
            placeholder="e.g. 5000000"
          />
        </Field>
      </div>

      <ArrayTextarea
        label="Pros"
        hint="One per line, 1–10 items"
        value={arrayFields.pros}
        onChange={(v) => handleArrayChange('pros', v)}
        required
      />

      <ArrayTextarea
        label="Cons"
        hint="One per line, 1–10 items"
        value={arrayFields.cons}
        onChange={(v) => handleArrayChange('cons', v)}
        required
      />

      <ArrayTextarea
        label="Best for"
        hint="One per line, 1–10 items"
        value={arrayFields.best_for}
        onChange={(v) => handleArrayChange('best_for', v)}
        required
      />

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {isPending
            ? isEdit
              ? 'Saving…'
              : 'Submitting…'
            : isEdit
              ? 'Save changes'
              : 'Submit for review'}
        </button>
        {isEdit && (
          <Link
            href="/contributor"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
      {children}
    </div>
  );
}

interface ArrayTextareaProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function ArrayTextarea({ label, hint, value, onChange, required }: ArrayTextareaProps) {
  return (
    <Field label={label} hint={hint} required={required}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={2500}
        className={inputClass}
        placeholder="One item per line"
      />
    </Field>
  );
}
