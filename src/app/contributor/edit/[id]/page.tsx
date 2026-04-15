export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { getUserRole, getContributionById } from '@/lib/supabase/queries/contributions';
import { AccessDenied } from '@/components/contributor/AccessDenied';
import { ContributionForm } from '@/components/contributor/ContributionForm';
import { technologySubmissionSchema } from '@/lib/validators/contribution';
import type { TechnologySubmissionInput } from '@/lib/validators/contribution';

const idSchema = z.string().uuid();

interface EditContributionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContributionPage({ params }: EditContributionPageProps) {
  const { id } = await params;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const role = await getUserRole(user.id);

  if (role !== 'contributor' && role !== 'admin') {
    return <AccessDenied />;
  }

  const contribution = await getContributionById(parsed.data, user.id);
  if (!contribution) notFound();

  if (contribution.status !== 'pending') {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-10 text-center max-w-md mx-auto mt-12">
        <h2 className="text-base font-semibold text-zinc-900">Cannot edit this submission</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Only pending submissions can be edited. This submission has already been{' '}
          {contribution.status}.
        </p>
        <a
          href="/contributor"
          className="mt-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          Back to submissions
        </a>
      </div>
    );
  }

  // Parse stored technology_data back through the schema for type-safe initial values
  const initialDataResult = technologySubmissionSchema.safeParse(contribution.technology_data);
  const initialData: Partial<TechnologySubmissionInput> | null = initialDataResult.success
    ? initialDataResult.data
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <a href="/contributor" className="hover:text-zinc-700 transition-colors">
          Contributor panel
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-600">Edit submission</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Edit submission</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update the technology details and resubmit for review.
        </p>
      </div>

      <ContributionForm initialData={initialData} contributionId={contribution.id} />
    </div>
  );
}
