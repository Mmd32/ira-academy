import { ui } from '@/server/ui';
import type { Metadata } from 'next';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { LeadForm } from '@/components/LeadForm';
import { community as communitySeed } from '@/content/pages';
import { getPage, getSite } from '@/server/content';

export const metadata: Metadata = {
  description:
    'باشگاه اعضای آکادمی، جایی برای شبکه‌سازی، ایجاد ارتباطات ارزشمند، تبادل تجربه و آگاهی از رویدادهای جامعه ریتیل.',
  title: 'جامعه حرفه‌ای ARI',
  alternates: { canonical: '/community/' },
};

/** The album grid is hidden until there are event photographs. The markup stays. */
const SHOW_ALBUMS = false;

export default function CommunityPage() {
  const site = getSite();
  const community = getPage('community', communitySeed as unknown as typeof communitySeed);
  return (
    <>
      <PageHeader
        eyebrow={ui('page.community.eyebrow')}
        title={ui('page.community.title')}
        lead={ui('page.community.lead')}
      />

      <section id="club" className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-3xl sm:text-4xl">باشگاه اعضای ARI</h2>
              <p className="mt-4 max-w-xl leading-8 text-ink-soft">{community.clubIntro}</p>
            </Reveal>
            <Reveal>
              <h3 className="mt-8 font-extrabold text-brand">مزایای عضویت</h3>
              <ul className="mt-4 space-y-3">
                {community.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm leading-7 text-ink-soft">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10 text-[10px] font-black text-gold">
                      ✓
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal>
            <div id="join" className="card p-8">
              <h3 className="text-lg font-extrabold text-ink">فرم درخواست عضویت</h3>
              <p className="mb-6 mt-1 text-sm text-ink-mute">
                پس از بررسی، نتیجه از طریق تماس یا پیامک اعلام می‌شود.
              </p>
              <LeadForm
                subject="درخواست عضویت در باشگاه ARI"
                cta="ارسال درخواست"
                email={String(site.email ?? '')}
                fields={['name', 'phone', 'company', 'position', 'note']}
                labels={{ company: 'سازمان' }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="events" className="section border-t border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">رویدادها</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">آلبوم رویدادهای آکادمی</h2>
            <p className="mt-4 max-w-2xl text-ink-soft">
              تصاویر رویدادها پس از هر برنامه در همین بخش منتشر می‌شود.
            </p>
          </Reveal>

          {SHOW_ALBUMS && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {community.albums.map((album) => (
              <Reveal key={album.title}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className={`absolute inset-0 ${album.tone}`} />
                  <div className="navy-grid absolute inset-0 opacity-40" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 to-transparent p-5 text-white">
                    <span className="text-[10px] font-bold text-white/70">
                      آلبوم تصاویر
                    </span>
                    <h3 className="mt-1 font-extrabold leading-7">{album.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
