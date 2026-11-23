import { groupLandline, telHref } from '@/lib/text';

/**
 * Each landline written out in full and tappable, so a phone offers to call
 * it. Every number is its own link and its own left-to-right island, which
 * keeps the digit groups in order inside right-to-left text.
 */
export function PhoneLinks({
  numbers,
  className,
  linkClassName = '',
  stacked = false,
}: {
  numbers: (string | undefined)[];
  className?: string;
  linkClassName?: string;
  stacked?: boolean;
}) {
  const list = numbers.filter((n): n is string => !!n && !!telHref(n));

  return (
    <span className={className}>
      {list.map((number, i) => (
        <span key={number} className={stacked ? 'block' : undefined}>
          {i > 0 && !stacked && <span className="mx-2 font-normal opacity-60">و</span>}
          <a
            href={telHref(number)}
            dir="ltr"
            style={{ unicodeBidi: 'isolate' }}
            className={`inline-block transition-opacity hover:opacity-75 ${linkClassName}`}
          >
            {groupLandline(number)}
          </a>
        </span>
      ))}
    </span>
  );
}
