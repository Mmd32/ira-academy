import { currentUser } from '@/server/auth';
import { allResultsWorkbook } from '@/server/exam-export';

export const dynamic = 'force-dynamic';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function GET() {
  if (!currentUser()) return new Response('Unauthorized', { status: 401 });

  const file = allResultsWorkbook();
  return new Response(new Uint8Array(file.data), {
    headers: {
      'Content-Type': XLSX,
      'Content-Disposition': `attachment; filename="results.xlsx"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      'Cache-Control': 'no-store',
    },
  });
}
