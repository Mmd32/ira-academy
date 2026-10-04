/**
 * Before/after plan view for the supermarket case study.
 *
 * Inline SVG rather than a file, so the Persian labels inherit the page font
 * instead of falling back to whatever the viewer's system provides. The svg
 * is forced to LTR: the page is RTL, and that flips text anchoring inside SVG.
 * The entrance and checkout are labelled in the HTML legend underneath rather
 * than inside the drawing, where they collided with the store outline.
 */

const NAVY = '#1B2C74';
const GOLD = '#C2A56C';
const GREEN = '#2A5652';
const LINE = '#DDE1EA';

type Shelf = { x: number; y: number; w: number; h: number; label?: string };

/** Aisles are identical in both plans; only نان and لبنیات move. */
const AISLES: Shelf[] = [
  { x: 16, y: 24, w: 9, h: 62 },
  { x: 32, y: 24, w: 9, h: 62 },
  { x: 48, y: 24, w: 9, h: 62 },
  { x: 64, y: 24, w: 9, h: 62 },
];

const BEFORE: Shelf[] = [
  { x: 82, y: 24, w: 26, h: 26, label: 'نان' },
  { x: 82, y: 58, w: 26, h: 28, label: 'لبنیات' },
];

const AFTER: Shelf[] = [
  { x: 16, y: 24, w: 26, h: 26, label: 'لبنیات' },
  { x: 16, y: 58, w: 26, h: 28, label: 'نان' },
];

/** After the move the first two aisles are taken by نان/لبنیات. */
const AFTER_AISLES = AISLES.slice(2).concat([
  { x: 82, y: 24, w: 9, h: 62 },
  { x: 97, y: 24, w: 9, h: 62 },
]);

function Plan({
  title,
  aisles,
  anchors,
  path,
}: {
  title: string;
  aisles: Shelf[];
  anchors: Shelf[];
  path: string;
}) {
  return (
    <div className="flex-1">
      <p className="mb-3 text-center text-sm font-extrabold text-ink">{title}</p>
      <svg
        viewBox="0 0 124 100"
        className="w-full rounded-2xl border border-line bg-white"
        style={{ direction: 'ltr' }}
        role="img"
        aria-label={`نقشه‌ی ${title}`}
      >
        <rect x="8" y="14" width="108" height="78" rx="3" fill="#F6F7F9" stroke={LINE} />

        {aisles.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx="1.5" fill="#E6E9F0" />
        ))}

        {anchors.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="1.5" fill={GOLD} opacity="0.92" />
            <text
              x={s.x + s.w / 2}
              y={s.y + s.h / 2 + 2}
              fontSize="6"
              fontWeight="700"
              fill="#0E1633"
              textAnchor="middle"
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* entrance (green) and checkout (navy), keyed in the legend below */}
        <rect x="6" y="78" width="4" height="14" rx="1" fill={GREEN} />
        <rect x="100" y="78" width="16" height="8" rx="1.5" fill={NAVY} />

        <path
          d={path}
          fill="none"
          stroke={GREEN}
          strokeWidth="1.6"
          strokeDasharray="3.5 2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function StoreLayoutDiagram() {
  return (
    <div className="my-12">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* RTL puts the first child on the right, which is where «قبل» belongs. */}
        <Plan
          title="قبل"
          aisles={AISLES}
          anchors={BEFORE}
          path="M 10 88 L 95 88 L 95 70 L 99 70 L 99 82"
        />
        <Plan
          title="بعد"
          aisles={AFTER_AISLES}
          anchors={AFTER}
          path="M 10 88 L 29 88 L 29 52 L 29 20 L 112 20 L 112 60 L 108 60 L 108 82"
        />
      </div>

      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-mute">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: GREEN }} />
          ورودی
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: NAVY }} />
          صندوق
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: GOLD }} />
          کالای پرتردد
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-6" style={{ background: GREEN }} />
          مسیر معمول مشتری
        </li>
      </ul>

      <p className="mt-4 text-center text-sm leading-7 text-ink-mute">
        جابه‌جایی نان و لبنیات به انتهای فروشگاه، مسیر مشتری را از یک رفت‌وبرگشت کوتاه به عبور از
        کل سالن تبدیل کرد.
      </p>
    </div>
  );
}
