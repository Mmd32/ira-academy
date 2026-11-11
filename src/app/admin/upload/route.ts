import { currentUser } from '@/server/auth';
import { saveUpload } from '@/server/uploads';

export const dynamic = 'force-dynamic';

/** Admin-only picture upload. A route handler has no layout to guard it, so it checks for itself. */
export async function POST(request: Request) {
  if (!currentUser()) return Response.json({ error: 'وارد نشده‌اید' }, { status: 401 });

  let file: FormDataEntryValue | null = null;
  try {
    file = (await request.formData()).get('file');
  } catch {
    return Response.json({ error: 'درخواست نامعتبر' }, { status: 400 });
  }
  if (!(file instanceof File)) return Response.json({ error: 'فایلی ارسال نشد' }, { status: 400 });

  const result = saveUpload(Buffer.from(await file.arrayBuffer()));
  return 'error' in result ? Response.json(result, { status: 422 }) : Response.json(result);
}
