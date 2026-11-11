'use client';

import { deleteCourseAction } from '../content-actions';

export function DeleteCourseButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteCourseAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `دوره‌ی «${title}» حذف شود؟ اگر فقط می‌خواهید موقتاً از سایت برداریدش، به‌جای حذف آن را خاموش کنید.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-ink-mute hover:text-red-700">
        حذف
      </button>
    </form>
  );
}
