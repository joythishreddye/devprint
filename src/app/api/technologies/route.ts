import { NextResponse, type NextRequest } from 'next/server';
import { getCachedTechnologies, getCachedTechnologiesByCategory } from '@/lib/supabase/queries/cached';
import { technologiesQuerySchema } from '@/lib/validators/api-params';

const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=60';

/** GET /api/technologies — list all technologies, optionally filtered by ?category= */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const raw = { category: searchParams.get('category') ?? undefined };

  const parsed = technologiesQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid query params' },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data.category
      ? await getCachedTechnologiesByCategory(parsed.data.category)
      : await getCachedTechnologies();

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': CACHE_CONTROL } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technologies' },
      { status: 500 },
    );
  }
}
