/* ═══════════════════════════════════════════════════════
   NextSafar — دیتای سکشن‌های صفحه اصلی
   ✅ اگه rest_base هر پست‌تایپ/تاکسونومی متفاوت بود، فقط HOME_ROUTES رو عوض کن
═══════════════════════════════════════════════════════ */

const WP =
  process.env.WP_API_URL ||
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "http://nextsafar.local/wp-json";

export const HOME_ROUTES = {
  visa: "visa",
  guide: "travelguide",
  news: "travelnews",
  tourism: "tourism",
} as const;

const REVALIDATE = 600; /* کش ۱۰ دقیقه‌ای ISR */

export interface HomePost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  category: string | null;
  date: string | null;
}

export interface HomeTerm {
  id: number;
  slug: string;
  name: string;
  count: number;
  image: string | null;
}

/* ═══ fetch ایمن: هر خطا = null (سکشن مخفی می‌شه، صفحه نمی‌شکنه) ═══ */
async function wp<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${WP}/${path}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function strip(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function embedImage(post: any): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media || media.media_type !== "image") return null;
  return media?.media_details?.sizes?.large?.source_url ?? media?.source_url ?? null;
}

function embedCategory(post: any): string | null {
  const terms = post?._embedded?.["wp:term"];
  if (!Array.isArray(terms) || !terms[0]?.length) return null;
  return terms[0][0]?.name ?? null;
}

function mapPost(p: any): HomePost {
  return {
    id: p.id,
    slug: p.slug,
    title: strip(p?.title?.rendered ?? ""),
    excerpt: strip(p?.excerpt?.rendered ?? "").slice(0, 120),
    image: embedImage(p),
    category: embedCategory(p),
    date: p?.date ?? null,
  };
}

/* ═══ ویزا ═══ */
export async function getVisaPosts(count = 8): Promise<HomePost[]> {
  const raw = await wp<any[]>(
    `${HOME_ROUTES.visa}?per_page=${count}&_embed&orderby=date&order=desc`,
  );
  return (raw ?? []).map(mapPost);
}

/* ═══ راهنمای سفر ═══ */
export async function getGuidePosts(count = 4): Promise<HomePost[]> {
  const raw = await wp<any[]>(
    `${HOME_ROUTES.guide}?per_page=${count}&_embed&orderby=date&order=desc`,
  );
  return (raw ?? []).map(mapPost);
}

/* ═══ اخبار ═══ */
export async function getNewsPosts(count = 6): Promise<HomePost[]> {
  const raw = await wp<any[]>(
    `${HOME_ROUTES.news}?per_page=${count}&_embed&orderby=date&order=desc`,
  );
  return (raw ?? []).map(mapPost);
}

/* ═══ ترم‌های شهر توریستی (کالکشن‌ها) ═══ */
export async function getTourismTerms(count = 8): Promise<HomeTerm[]> {
  const raw = await wp<any[]>(
    `${HOME_ROUTES.tourism}?per_page=${count}&orderby=count&order=desc&hide_empty=true`,
  );
  return (raw ?? []).map((t) => ({
    id: t.id,
    slug: t.slug,
    name: strip(t.name ?? ""),
    count: t.count ?? 0,
    /* تصویر ترم: هر کدام از فیلدهای محتمل که registered باشه */
    image: t?.image ?? t?.image_url ?? t?.meta?.image ?? t?.term_image ?? null,
  }));
}

/* ═══ فرمت‌های فارسی ═══ */
export function formatFa(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatFaDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { month: "long", day: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return "";
  }
}