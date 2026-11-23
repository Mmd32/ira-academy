import { requireAdmin } from '@/server/guard';
import { IMAGE_SLOTS, getImages } from '@/server/images';

import { PageTitle } from '../ui';
import { ImagesForm } from './ImagesForm';

export const dynamic = 'force-dynamic';

export default function ImagesPage() {
  requireAdmin();
  const current = getImages();
  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="تصاویر سایت"
        lead="لوگو و تصاویر ثابت صفحه‌ها. عکس تازه را انتخاب کنید و ذخیره بزنید. «حذف عکس» تصویر اصلی را برمی‌گرداند. تصویر هر اسلاید هیرو در «متن‌های سایت»، عکس مقاله‌ها در ویرایش مقاله و عکس افراد و آلبوم‌ها در «افراد» و «متن صفحه‌ها» است."
      />
      <div className="mt-8">
        <ImagesForm slots={IMAGE_SLOTS.map((s) => ({ ...s, value: current[s.key], original: s.default }))} />
      </div>
    </>
  );
}
