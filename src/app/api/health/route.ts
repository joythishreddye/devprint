import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from('technologies').select('id').limit(1);

    const dbStatus = error ? 'disconnected' : 'connected';

    return NextResponse.json({
      status: 'ok',
      db: dbStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`,
      },
      { status: 503 }
    );
  }
}
