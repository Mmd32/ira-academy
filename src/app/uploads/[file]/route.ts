import { readUpload } from '@/server/uploads';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  const found = readUpload(params.file);
  if (!found) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(found.data), {
    headers: {
      'Content-Type': found.type,
      // The name is random per upload, so a given URL never changes its picture.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
