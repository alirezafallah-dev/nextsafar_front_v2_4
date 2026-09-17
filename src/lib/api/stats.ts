/* ═══════════════════════════════════════════════════════════
   آمار زنده سایت
   ۱) اول endpoint اختصاصی پلاگین
   ۲) فال‌بک: تست چند rest_base احتمالی
═══════════════════════════════════════════════════════════ */
const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || "http://nextsafar.local/wp-json";

export type SiteStats = Record<string, number>;

export async function getSiteStats(): Promise<SiteStats> {
  /* ─── روش ۱: endpoint اختصاصی ─── */
  try {
    const res = await fetch(`${WP_API_URL}/nextsafar/v1/stats`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.counts) return data.counts as SiteStats;
    }
  } catch {
    /* رفت به فال‌بک */
  }

  /* ─── روش ۲: فال‌بک با چند rest_base احتمالی ─── */
  const candidates: Record<string, string[]> = {
    hotel: ["hotel", "hotels"],
    destination: ["destination", "destinations"],
    tour: ["tour", "tours"],
    visa: ["visa", "visas"],
    travelguide: ["travelguide", "travelguides", "travel-guide"],
    restaurant: ["restaurant", "restaurants"],
  };

  const out: SiteStats = {};
  await Promise.all(
    Object.entries(candidates).map(async ([key, bases]) => {
      for (const base of bases) {
        const n = await getCountByBase(base);
        if (n !== null) {
          out[key] = n;
          return;
        }
      }
      out[key] = 0;
    }),
  );
  return out;
}

async function getCountByBase(base: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${WP_API_URL}/wp/v2/${base}?per_page=1&_fields=id`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const total = res.headers.get("x-wp-total");
    return total ? parseInt(total, 10) : 0;
  } catch {
    return null;
  }
}
