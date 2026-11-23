'use client';

export function DeletePersonButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      className="text-xs font-bold text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm(`پروفایل «${name}» حذف شود؟ مقاله‌هایش می‌مانند ولی دیگر به این صفحه لینک نمی‌شوند.`)) e.preventDefault();
      }}
    >
      حذف پروفایل
    </button>
  );
}
