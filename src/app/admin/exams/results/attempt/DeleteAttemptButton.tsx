'use client';

export function DeleteAttemptButton() {
  return (
    <button
      type="submit"
      className="text-xs font-bold text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm('این دفعه‌ی شرکت پاک شود تا دانش‌پذیر بتواند دوباره امتحان بدهد؟ نمره‌اش از فهرست حذف می‌شود.')) {
          e.preventDefault();
        }
      }}
    >
      حذف این دفعه‌ی شرکت (اجازه‌ی آزمون دوباره)
    </button>
  );
}
