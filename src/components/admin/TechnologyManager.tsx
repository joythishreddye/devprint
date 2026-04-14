'use client';

import { useState, useTransition } from 'react';
import {
  createTechnologyAction,
  updateTechnologyAction,
  deleteTechnologyAction,
} from '@/app/admin/actions';
import type { Technology } from '@/types/database';

export interface TechnologyManagerProps {
  technologies: Technology[];
}

type ViewMode = 'list' | 'create' | 'edit';

export function TechnologyManager({ technologies: initialTechs }: TechnologyManagerProps) {
  const [techs, setTechs] = useState(initialTechs);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editing, setEditing] = useState<Technology | null>(null);

  function handleEdit(tech: Technology) {
    setEditing(tech);
    setViewMode('edit');
  }

  function handleCreate() {
    setEditing(null);
    setViewMode('create');
  }

  function handleBack() {
    setEditing(null);
    setViewMode('list');
  }

  function handleSaved(tech: Technology) {
    setTechs((prev) => {
      const idx = prev.findIndex((t) => t.id === tech.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = tech;
        return next;
      }
      return [tech, ...prev];
    });
    handleBack();
  }

  function handleDeleted(id: string) {
    setTechs((prev) => prev.filter((t) => t.id !== id));
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <TechnologyForm
        technology={editing}
        onSaved={handleSaved}
        onCancel={handleBack}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{techs.length} technologies</p>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Add technology
        </button>
      </div>

      {techs.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-8 text-center">
          <p className="text-sm text-zinc-500">No technologies yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {techs.map((tech) => (
            <TechnologyRow
              key={tech.id}
              technology={tech}
              onEdit={() => handleEdit(tech)}
              onDeleted={() => handleDeleted(tech.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TechnologyRow({
  technology,
  onEdit,
  onDeleted,
}: {
  technology: Technology;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set('id', technology.id);
      const result = await deleteTechnologyAction(formData);
      if (!result.success) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      onDeleted();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{technology.name}</p>
        <p className="text-xs text-zinc-400">{technology.slug} &middot; {technology.category}</p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Edit
        </button>
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Delete &ldquo;{technology.name}&rdquo;?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded px-2 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Deleting…' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-xs text-zinc-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function TechnologyForm({
  technology,
  onSaved,
  onCancel,
}: {
  technology: Technology | null;
  onSaved: (tech: Technology) => void;
  onCancel: () => void;
}) {
  const isEdit = technology !== null;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [arrayFields, setArrayFields] = useState({
    pros: (technology?.pros ?? ['']).join('\n'),
    cons: (technology?.cons ?? ['']).join('\n'),
    best_for: (technology?.best_for ?? ['']).join('\n'),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('pros', arrayFields.pros);
    formData.set('cons', arrayFields.cons);
    formData.set('best_for', arrayFields.best_for);

    startTransition(async () => {
      const result = isEdit
        ? await updateTechnologyAction(formData)
        : await createTechnologyAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }
      onSaved(result.data);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          ← Back
        </button>
        <h3 className="text-sm font-semibold text-zinc-900">
          {isEdit ? `Edit: ${technology.name}` : 'Add technology'}
        </h3>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isEdit && <input type="hidden" name="id" value={technology.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <input name="name" defaultValue={technology?.name ?? ''} required maxLength={100} className={inputClass} />
        </Field>
        <Field label="Slug" required hint="Lowercase kebab-case">
          <input name="slug" defaultValue={technology?.slug ?? ''} required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputClass} />
        </Field>
        <Field label="Category" required>
          <input name="category" defaultValue={technology?.category ?? ''} required maxLength={50} className={inputClass} />
        </Field>
        <Field label="Learning curve" required>
          <select name="learning_curve" defaultValue={technology?.learning_curve ?? 'intermediate'} required className={inputClass}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Community size" required>
          <select name="community_size" defaultValue={technology?.community_size ?? 'medium'} required className={inputClass}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>
        <Field label="Maturity" required>
          <select name="maturity" defaultValue={technology?.maturity ?? 'growing'} required className={inputClass}>
            <option value="emerging">Emerging</option>
            <option value="growing">Growing</option>
            <option value="mature">Mature</option>
            <option value="declining">Declining</option>
          </select>
        </Field>
      </div>

      <Field label="Description" required>
        <textarea name="description" defaultValue={technology?.description ?? ''} required maxLength={2000} rows={3} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Logo URL">
          <input name="logo_url" defaultValue={technology?.logo_url ?? ''} type="url" className={inputClass} />
        </Field>
        <Field label="Website URL">
          <input name="website_url" defaultValue={technology?.website_url ?? ''} type="url" className={inputClass} />
        </Field>
        <Field label="GitHub URL">
          <input name="github_url" defaultValue={technology?.github_url ?? ''} type="url" className={inputClass} />
        </Field>
        <Field label="npm package">
          <input name="npm_package" defaultValue={technology?.npm_package ?? ''} maxLength={214} className={inputClass} />
        </Field>
        <Field label="GitHub stars">
          <input name="github_stars" defaultValue={technology?.github_stars ?? ''} type="number" min={0} step={1} className={inputClass} />
        </Field>
        <Field label="npm weekly downloads">
          <input name="npm_weekly_downloads" defaultValue={technology?.npm_weekly_downloads ?? ''} type="number" min={0} step={1} className={inputClass} />
        </Field>
      </div>

      {(['pros', 'cons', 'best_for'] as const).map((field) => (
        <Field key={field} label={field.replace('_', ' ')} hint="One per line, 1–10 items" required>
          <textarea
            value={arrayFields[field]}
            onChange={(e) => setArrayFields((prev) => ({ ...prev, [field]: e.target.value }))}
            rows={3}
            maxLength={2500}
            className={inputClass}
            placeholder="One item per line"
          />
        </Field>
      ))}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create technology'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          Cancel
        </button>
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
