'use client';

export function DeleteOrgButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      className="text-xs font-bold text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm(`سازمان «${name}» و همه‌ی کدهای دانشجویی‌اش حذف شود؟ نتیجه‌های آزمون‌های گذشته می‌مانند و کد روی آن‌ها ثبت‌شده باقی است.`)) {
          e.preventDefault();
        }
      }}
    >
      حذف سازمان
    </button>
  );
}
