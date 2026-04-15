import { NextResponse, type NextRequest } from 'next/server';
import { getCachedTechnologyBySlug } from '@/lib/supabase/queries/cached';
import { technologySlugSchema } from '@/lib/validators/api-params';

const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=60';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** GET /api/technologies/[slug] — fetch a single technology by slug */
export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { slug } = await params;

  const parsed = technologySlugSchema.safeParse({ slug });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid slug' },
      { status: 400 },
    );
  }

  try {
    const data = await getCachedTechnologyBySlug(parsed.data.slug);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Technology not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': CACHE_CONTROL } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technology' },
      { status: 500 },
    );
  }
}
