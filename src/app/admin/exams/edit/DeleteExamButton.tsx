'use client';

export function DeleteExamButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="text-xs font-bold text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm(`آزمون «${title}» با همه‌ی سؤال‌ها و نمره‌های ثبت‌شده حذف شود؟ این کار برگشت ندارد.`)) {
          e.preventDefault();
        }
      }}
    >
      حذف آزمون
    </button>
  );
}
