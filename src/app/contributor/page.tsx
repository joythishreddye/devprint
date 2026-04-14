export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { getUserRole, getUserContributions } from '@/lib/supabase/queries/contributions';
import { AccessDenied } from '@/components/contributor/AccessDenied';
import { ContributionForm } from '@/components/contributor/ContributionForm';
import { ContributionList } from '@/components/contributor/ContributionList';

export default async function ContributorPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const role = await getUserRole(user.id);

  if (role !== 'contributor' && role !== 'admin') {
    return <AccessDenied />;
  }

  const contributions = await getUserContributions(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Contributor panel</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Submit new technologies for review by the DevPrint team.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">Submit a technology</h2>
        <ContributionForm />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">Your submissions</h2>
        <ContributionList contributions={contributions} />
      </section>
    </div>
  );
}
