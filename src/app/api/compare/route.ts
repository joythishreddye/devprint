import { NextResponse, type NextRequest } from 'next/server';
import { getCachedTechnologyBySlug } from '@/lib/supabase/queries/cached';
import { compareQuerySchema } from '@/lib/validators/api-params';
import {
  compareTechnologies,
  generateComparisonSummary,
} from '@/lib/comparison/compare-technologies';

const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=60';

/** GET /api/compare?a=slug-a&b=slug-b — compare two technologies by slug */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const raw = {
    a: searchParams.get('a') ?? undefined,
    b: searchParams.get('b') ?? undefined,
  };

  const parsed = compareQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid query params' },
      { status: 400 },
    );
  }

  const { a, b } = parsed.data;

  try {
    const [techA, techB] = await Promise.all([
      getCachedTechnologyBySlug(a),
      getCachedTechnologyBySlug(b),
    ]);

    if (!techA) {
      return NextResponse.json(
        { success: false, error: `Technology "${a}" not found` },
        { status: 404 },
      );
    }
    if (!techB) {
      return NextResponse.json(
        { success: false, error: `Technology "${b}" not found` },
        { status: 404 },
      );
    }

    const result = compareTechnologies(techA, techB);
    const summary = generateComparisonSummary(result);

    return NextResponse.json(
      { success: true, data: { result, summary } },
      { headers: { 'Cache-Control': CACHE_CONTROL } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to compare technologies' },
      { status: 500 },
    );
  }
}
