import { currentUser } from '@/server/auth';
import { examWorkbook } from '@/server/exam-export';

export const dynamic = 'force-dynamic';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Score sheet for one exam. Admin only: a route handler has no layout to guard it. */
export async function GET(request: Request) {
  if (!currentUser()) return new Response('Unauthorized', { status: 401 });

  const id = Number(new URL(request.url).searchParams.get('id'));
  const file = id ? examWorkbook(id) : null;
  if (!file) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      'Content-Type': XLSX,
      'Content-Disposition': `attachment; filename="results.xlsx"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      'Cache-Control': 'no-store',
    },
  });
}
