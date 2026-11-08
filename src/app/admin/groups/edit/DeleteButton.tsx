'use client';

export function DeleteButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      className="text-xs font-bold text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm(`گروه «${name}» حذف شود؟ دانش‌پذیران و نتیجه‌ها حذف نمی‌شوند، فقط دسترسی گروه به آزمون‌ها برداشته می‌شود.`)) {
          e.preventDefault();
        }
      }}
    >
      حذف گروه
    </button>
  );
}
