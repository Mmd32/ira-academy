/**
 * Every piece of wording the panel can change without a code edit: the header,
 * the footer, the page mastheads and the home page sections and calls to
 * action. The defaults here are what the site shipped with, so an empty field
 * in the panel always means "use this".
 *
 * `href` items are links and are checked before they are saved; `long` items
 * get a multi-line box.
 */

export type UiItem = {
  key: string;
  group: string;
  label: string;
  default: string;
  kind: 'text' | 'long' | 'href';
};

export const UI_ITEMS: readonly UiItem[] = [
  {
    "key": "nav.1.label",
    "group": "هدر: منو",
    "label": "منوی 1: عنوان",
    "default": "معرفی",
    "kind": "text"
  },
  {
    "key": "nav.1.href",
    "group": "هدر: منو",
    "label": "منوی 1: لینک",
    "default": "/about/",
    "kind": "href"
  },
  {
    "key": "nav.2.label",
    "group": "هدر: منو",
    "label": "منوی 2: عنوان",
    "default": "برنامه‌های آموزشی",
    "kind": "text"
  },
  {
    "key": "nav.2.href",
    "group": "هدر: منو",
    "label": "منوی 2: لینک",
    "default": "/programs/",
    "kind": "href"
  },
  {
    "key": "nav.3.label",
    "group": "هدر: منو",
    "label": "منوی 3: عنوان",
    "default": "خدمات سازمانی",
    "kind": "text"
  },
  {
    "key": "nav.3.href",
    "group": "هدر: منو",
    "label": "منوی 3: لینک",
    "default": "/corporate/",
    "kind": "href"
  },
  {
    "key": "nav.4.label",
    "group": "هدر: منو",
    "label": "منوی 4: عنوان",
    "default": "جامعه ARI",
    "kind": "text"
  },
  {
    "key": "nav.4.href",
    "group": "هدر: منو",
    "label": "منوی 4: لینک",
    "default": "/community/",
    "kind": "href"
  },
  {
    "key": "nav.5.label",
    "group": "هدر: منو",
    "label": "منوی 5: عنوان",
    "default": "کتابخانه",
    "kind": "text"
  },
  {
    "key": "nav.5.href",
    "group": "هدر: منو",
    "label": "منوی 5: لینک",
    "default": "/knowledge/",
    "kind": "href"
  },
  {
    "key": "nav.6.label",
    "group": "هدر: منو",
    "label": "منوی 6: عنوان",
    "default": "مقالات",
    "kind": "text"
  },
  {
    "key": "nav.6.href",
    "group": "هدر: منو",
    "label": "منوی 6: لینک",
    "default": "/knowledge/#articles",
    "kind": "href"
  },
  {
    "key": "nav.7.label",
    "group": "هدر: منو",
    "label": "منوی 7: عنوان",
    "default": "تماس",
    "kind": "text"
  },
  {
    "key": "nav.7.href",
    "group": "هدر: منو",
    "label": "منوی 7: لینک",
    "default": "/contact/",
    "kind": "href"
  },
  {
    "key": "nav.cta.label",
    "group": "هدر: دکمه‌ها",
    "label": "دکمه‌ی اول (ثبت‌نام): عنوان",
    "default": "ثبت‌نام",
    "kind": "text"
  },
  {
    "key": "nav.cta.href",
    "group": "هدر: دکمه‌ها",
    "label": "دکمه‌ی اول: لینک",
    "default": "/register/",
    "kind": "href"
  },
  {
    "key": "nav.login.label",
    "group": "هدر: دکمه‌ها",
    "label": "دکمه‌ی دوم (ورود): عنوان",
    "default": "ورود",
    "kind": "text"
  },
  {
    "key": "nav.login.href",
    "group": "هدر: دکمه‌ها",
    "label": "دکمه‌ی دوم: لینک",
    "default": "/portal/",
    "kind": "href"
  },
  {
    "key": "nav.mobileLogin",
    "group": "هدر: دکمه‌ها",
    "label": "لینک ورود در منوی موبایل",
    "default": "ورود دانش‌پذیران",
    "kind": "text"
  },
  {
    "key": "footer.1.title",
    "group": "فوتر",
    "label": "ستون 1: عنوان",
    "default": "آکادمی",
    "kind": "text"
  },
  {
    "key": "footer.1.1.label",
    "group": "فوتر",
    "label": "ستون 1، لینک 1: عنوان",
    "default": "معرفی",
    "kind": "text"
  },
  {
    "key": "footer.1.1.href",
    "group": "فوتر",
    "label": "ستون 1، لینک 1: آدرس",
    "default": "/about/",
    "kind": "href"
  },
  {
    "key": "footer.1.2.label",
    "group": "فوتر",
    "label": "ستون 1، لینک 2: عنوان",
    "default": "برنامه‌های آموزشی",
    "kind": "text"
  },
  {
    "key": "footer.1.2.href",
    "group": "فوتر",
    "label": "ستون 1، لینک 2: آدرس",
    "default": "/programs/",
    "kind": "href"
  },
  {
    "key": "footer.1.3.label",
    "group": "فوتر",
    "label": "ستون 1، لینک 3: عنوان",
    "default": "خدمات سازمانی",
    "kind": "text"
  },
  {
    "key": "footer.1.3.href",
    "group": "فوتر",
    "label": "ستون 1، لینک 3: آدرس",
    "default": "/corporate/",
    "kind": "href"
  },
  {
    "key": "footer.1.4.label",
    "group": "فوتر",
    "label": "ستون 1، لینک 4: عنوان",
    "default": "جامعه حرفه‌ای ARI",
    "kind": "text"
  },
  {
    "key": "footer.1.4.href",
    "group": "فوتر",
    "label": "ستون 1، لینک 4: آدرس",
    "default": "/community/",
    "kind": "href"
  },
  {
    "key": "footer.2.title",
    "group": "فوتر",
    "label": "ستون 2: عنوان",
    "default": "منابع",
    "kind": "text"
  },
  {
    "key": "footer.2.1.label",
    "group": "فوتر",
    "label": "ستون 2، لینک 1: عنوان",
    "default": "مقالات",
    "kind": "text"
  },
  {
    "key": "footer.2.1.href",
    "group": "فوتر",
    "label": "ستون 2، لینک 1: آدرس",
    "default": "/knowledge/#articles",
    "kind": "href"
  },
  {
    "key": "footer.2.2.label",
    "group": "فوتر",
    "label": "ستون 2، لینک 2: عنوان",
    "default": "لغت‌نامه ریتیل",
    "kind": "text"
  },
  {
    "key": "footer.2.2.href",
    "group": "فوتر",
    "label": "ستون 2، لینک 2: آدرس",
    "default": "/knowledge/#glossary",
    "kind": "href"
  },
  {
    "key": "footer.2.3.label",
    "group": "فوتر",
    "label": "ستون 2، لینک 3: عنوان",
    "default": "موردکاوی‌های کاربردی",
    "kind": "text"
  },
  {
    "key": "footer.2.3.href",
    "group": "فوتر",
    "label": "ستون 2، لینک 3: آدرس",
    "default": "/knowledge/#articles",
    "kind": "href"
  },
  {
    "key": "footer.2.4.label",
    "group": "فوتر",
    "label": "ستون 2، لینک 4: عنوان",
    "default": "ورود دانش‌پذیران",
    "kind": "text"
  },
  {
    "key": "footer.2.4.href",
    "group": "فوتر",
    "label": "ستون 2، لینک 4: آدرس",
    "default": "/portal/",
    "kind": "href"
  },
  {
    "key": "footer.3.title",
    "group": "فوتر",
    "label": "ستون 3: عنوان",
    "default": "ارتباط",
    "kind": "text"
  },
  {
    "key": "footer.3.1.label",
    "group": "فوتر",
    "label": "ستون 3، لینک 1: عنوان",
    "default": "تماس با آکادمی",
    "kind": "text"
  },
  {
    "key": "footer.3.1.href",
    "group": "فوتر",
    "label": "ستون 3، لینک 1: آدرس",
    "default": "/contact/",
    "kind": "href"
  },
  {
    "key": "footer.3.2.label",
    "group": "فوتر",
    "label": "ستون 3، لینک 2: عنوان",
    "default": "مدرس شوید",
    "kind": "text"
  },
  {
    "key": "footer.3.2.href",
    "group": "فوتر",
    "label": "ستون 3، لینک 2: آدرس",
    "default": "/contact/#teach",
    "kind": "href"
  },
  {
    "key": "footer.3.3.label",
    "group": "فوتر",
    "label": "ستون 3، لینک 3: عنوان",
    "default": "مشارکت و همکاری",
    "kind": "text"
  },
  {
    "key": "footer.3.3.href",
    "group": "فوتر",
    "label": "ستون 3، لینک 3: آدرس",
    "default": "/contact/#partner",
    "kind": "href"
  },
  {
    "key": "footer.3.4.label",
    "group": "فوتر",
    "label": "ستون 3، لینک 4: عنوان",
    "default": "ثبت‌نام",
    "kind": "text"
  },
  {
    "key": "footer.3.4.href",
    "group": "فوتر",
    "label": "ستون 3، لینک 4: آدرس",
    "default": "/register/",
    "kind": "href"
  },
  {
    "key": "footer.copyright",
    "group": "فوتر",
    "label": "متن پایین فوتر (بعد از سال و نام آکادمی)",
    "default": "همه‌ی حقوق محفوظ است.",
    "kind": "text"
  },
  {
    "key": "page.about.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "معرفی: برچسب کوچک بالای عنوان",
    "default": "معرفی آکادمی",
    "kind": "text"
  },
  {
    "key": "page.about.title",
    "group": "سربرگ صفحه‌ها",
    "label": "معرفی: عنوان بزرگ",
    "default": "آکادمی ریتیل ایران",
    "kind": "text"
  },
  {
    "key": "page.about.lead",
    "group": "سربرگ صفحه‌ها",
    "label": "معرفی: متن زیر عنوان",
    "default": "مرجع آموزش‌های تخصصی صنعت ریتیل.\nنقطه تلاقی دانش آکادمیک، تجربیات عملی\nو شبکه‌سازی مؤثر.",
    "kind": "long"
  },
  {
    "key": "page.programs.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "برنامه‌های آموزشی: برچسب کوچک بالای عنوان",
    "default": "برنامه‌های آموزشی",
    "kind": "text"
  },
  {
    "key": "page.programs.title",
    "group": "سربرگ صفحه‌ها",
    "label": "برنامه‌های آموزشی: عنوان بزرگ",
    "default": "دوره‌ها، کارگاه‌ها و سمینارها",
    "kind": "text"
  },
  {
    "key": "page.programs.lead",
    "group": "سربرگ صفحه‌ها",
    "label": "برنامه‌های آموزشی: متن زیر عنوان",
    "default": "دوره‌های تخصصی دانش‌محور، کارگاه‌های مهارت‌محور و سمینارها و وبینارهای آکادمی — کنار هر برنامه، لینک ثبت‌نام همان برنامه.",
    "kind": "long"
  },
  {
    "key": "page.corporate.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "خدمات سازمانی: برچسب کوچک بالای عنوان",
    "default": "خدمات سازمانی",
    "kind": "text"
  },
  {
    "key": "page.corporate.title",
    "group": "سربرگ صفحه‌ها",
    "label": "خدمات سازمانی: عنوان بزرگ",
    "default": "آموزش‌های سازمانی ویژه‌سازی‌شده",
    "kind": "text"
  },
  {
    "key": "page.corporate.lead",
    "group": "سربرگ صفحه‌ها",
    "label": "خدمات سازمانی: متن زیر عنوان",
    "default": "برنامه‌های توسعه سرمایه انسانی برای سازمان‌های فعال در صنعت ریتیل و فروشگاه‌داری؛\nاز نیازسنجی و طراحی مسیر آموزشی تا اجرا و ارزیابی یادگیری.",
    "kind": "long"
  },
  {
    "key": "page.community.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "جامعه ARI: برچسب کوچک بالای عنوان",
    "default": "جامعه حرفه‌ای ARI",
    "kind": "text"
  },
  {
    "key": "page.community.title",
    "group": "سربرگ صفحه‌ها",
    "label": "جامعه ARI: عنوان بزرگ",
    "default": "شبکه‌ای پویا از اهالی ریتیل",
    "kind": "text"
  },
  {
    "key": "page.community.lead",
    "group": "سربرگ صفحه‌ها",
    "label": "جامعه ARI: متن زیر عنوان",
    "default": "باشگاه اعضای آکادمی، جایی برای شبکه‌سازی، ایجاد ارتباطات ارزشمند، تبادل تجربه\nو آگاهی از رویدادهای جامعه ریتیل.",
    "kind": "long"
  },
  {
    "key": "page.knowledge.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "کتابخانه: برچسب کوچک بالای عنوان",
    "default": "کتابخانه ریتیل",
    "kind": "text"
  },
  {
    "key": "page.knowledge.title",
    "group": "سربرگ صفحه‌ها",
    "label": "کتابخانه: عنوان بزرگ",
    "default": "منبع تخصصی اخبار، مقالات و مِدیای صنعت ریتیل.",
    "kind": "text"
  },
  {
    "key": "page.register.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "ثبت‌نام: برچسب کوچک بالای عنوان",
    "default": "ثبت‌نام",
    "kind": "text"
  },
  {
    "key": "page.register.title",
    "group": "سربرگ صفحه‌ها",
    "label": "ثبت‌نام: عنوان بزرگ",
    "default": "ثبت‌نام در برنامه‌های آموزشی",
    "kind": "text"
  },
  {
    "key": "page.register.lead",
    "group": "سربرگ صفحه‌ها",
    "label": "ثبت‌نام: متن زیر عنوان",
    "default": "دوره موردنظر خود را انتخاب کنید و اطلاعات تماس‌تان را بگذارید؛\nکارشناسان آکادمی برای تکمیل ثبت‌نام با شما تماس می‌گیرند.",
    "kind": "long"
  },
  {
    "key": "page.contact.eyebrow",
    "group": "سربرگ صفحه‌ها",
    "label": "تماس: برچسب کوچک بالای عنوان",
    "default": "ارتباط با آکادمی",
    "kind": "text"
  },
  {
    "key": "page.contact.title",
    "group": "سربرگ صفحه‌ها",
    "label": "تماس: عنوان بزرگ",
    "default": "در تماس باشیم",
    "kind": "text"
  },
  {
    "key": "home.sections.eyebrow",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "برچسب بالای بخش",
    "default": "بخش‌های آکادمی",
    "kind": "text"
  },
  {
    "key": "home.sections.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "عنوان بخش",
    "default": "هر آنچه برای رشد فروشگاه و تیم‌تان لازم دارید",
    "kind": "text"
  },
  {
    "key": "home.tile.1.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 1: عنوان",
    "default": "معرفی آکادمی",
    "kind": "text"
  },
  {
    "key": "home.tile.1.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 1: توضیح",
    "default": "هویت، مأموریت و چشم‌انداز، هیئت مؤسس، کادر علمی و پارتنرهای آموزشی.",
    "kind": "long"
  },
  {
    "key": "home.tile.2.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 2: عنوان",
    "default": "برنامه‌های آموزشی",
    "kind": "text"
  },
  {
    "key": "home.tile.2.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 2: توضیح",
    "default": "دوره‌های تخصصی، کارگاه‌ها، سمینارها و وبینارها — با ثبت‌نام آنلاین.",
    "kind": "long"
  },
  {
    "key": "home.tile.3.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 3: عنوان",
    "default": "خدمات سازمانی",
    "kind": "text"
  },
  {
    "key": "home.tile.3.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 3: توضیح",
    "default": "آموزش‌های ویژه‌سازی‌شده، مشاوره و طراحی برنامه‌ی آموزشی برای سازمان‌ها.",
    "kind": "long"
  },
  {
    "key": "home.tile.4.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 4: عنوان",
    "default": "جامعه حرفه‌ای ARI",
    "kind": "text"
  },
  {
    "key": "home.tile.4.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 4: توضیح",
    "default": "باشگاه اعضا، رویدادها و شبکه‌ای پویا از دانش‌پذیران و متخصصان صنعت.",
    "kind": "long"
  },
  {
    "key": "home.tile.5.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 5: عنوان",
    "default": "کتابخانه ریتیل",
    "kind": "text"
  },
  {
    "key": "home.tile.5.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 5: توضیح",
    "default": "اخبار، مقالات و مورد کاوی، ویدیو و پادکست، ابزارهای کاربردی و لغت‌نامه.",
    "kind": "long"
  },
  {
    "key": "home.tile.6.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 6: عنوان",
    "default": "درگاه امور دانش‌پذیران",
    "kind": "text"
  },
  {
    "key": "home.tile.6.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 6: توضیح",
    "default": "ورود با شماره‌ی موبایل، شرکت در آزمون‌ها، دیدن نتیجه و مشاوره با کارشناسان.",
    "kind": "long"
  },
  {
    "key": "home.tile.7.title",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 7: عنوان",
    "default": "ارتباط با آکادمی",
    "kind": "text"
  },
  {
    "key": "home.tile.7.desc",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "کارت 7: توضیح",
    "default": "تماس، نشانی دفتر، درخواست مشاوره و مسیرهای همکاری با آکادمی.",
    "kind": "long"
  },
  {
    "key": "home.tile.more",
    "group": "صفحه‌ی اول: بخش‌ها",
    "label": "متن لینک هر کارت",
    "default": "مشاهده ←",
    "kind": "text"
  },
  {
    "key": "home.articles.eyebrow",
    "group": "صفحه‌ی اول: مقالات",
    "label": "برچسب",
    "default": "کتابخانه ریتیل",
    "kind": "text"
  },
  {
    "key": "home.articles.title",
    "group": "صفحه‌ی اول: مقالات",
    "label": "عنوان",
    "default": "تازه‌ترین مقالات",
    "kind": "text"
  },
  {
    "key": "home.articles.all",
    "group": "صفحه‌ی اول: مقالات",
    "label": "دکمه‌ی همه‌ی مقالات",
    "default": "همه‌ی مقالات",
    "kind": "text"
  },
  {
    "key": "home.articles.read",
    "group": "صفحه‌ی اول: مقالات",
    "label": "لینک هر مقاله",
    "default": "ادامه مطلب ←",
    "kind": "text"
  },
  {
    "key": "home.news.title",
    "group": "صفحه‌ی اول: اخبار",
    "label": "عنوان نوار اخبار",
    "default": "اخبار و رویدادها",
    "kind": "text"
  },
  {
    "key": "home.cta.title",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "عنوان",
    "default": "آماده‌ی شروع هستید؟",
    "kind": "text"
  },
  {
    "key": "home.cta.text",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "متن",
    "default": "در دوره‌ی مناسب ثبت‌نام کنید، یا اگر دانش‌پذیر آکادمی هستید، از درگاه دانش‌پذیران وارد شوید و آزمون‌ها و نتیجه‌هایتان را ببینید.",
    "kind": "long"
  },
  {
    "key": "home.cta.primary.label",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "دکمه‌ی طلایی: عنوان",
    "default": "ثبت‌نام در دوره‌ها",
    "kind": "text"
  },
  {
    "key": "home.cta.primary.href",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "دکمه‌ی طلایی: لینک",
    "default": "/register/",
    "kind": "href"
  },
  {
    "key": "home.cta.secondary.label",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "دکمه‌ی دوم: عنوان",
    "default": "ورود دانش‌پذیران",
    "kind": "text"
  },
  {
    "key": "home.cta.secondary.href",
    "group": "صفحه‌ی اول: دعوت به اقدام (CTA)",
    "label": "دکمه‌ی دوم: لینک",
    "default": "/portal/",
    "kind": "href"
  }
];

export const UI_DEFAULTS: Record<string, string> = Object.fromEntries(UI_ITEMS.map((i) => [i.key, i.default]));

/** Same-site paths, https links, mailto: and tel: only. Anything else (javascript:, data:) is refused. */
export function isSafeHref(value: string): boolean {
  return /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+|mailto:[^\s]+|tel:[+0-9-]+)$/.test(value);
}
