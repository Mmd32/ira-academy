'use client';

import { deleteArticleAction } from '../content-actions';

export function DeleteArticleButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      action={deleteArticleAction}
      onSubmit={(e) => {
        if (!window.confirm(`مقاله‌ی «${title}» حذف شود؟ این کار برگشت‌پذیر نیست.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="text-ink-mute hover:text-red-700">
        حذف
      </button>
    </form>
  );
}
