import { Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  formatToman,
  HotelQuery,
  searchHotels,
  validateHotelQuery,
} from "@/lib/search/providers";

export const dynamic = "force-dynamic";

const WP =
  process.env.NEXT_PUBLIC_WP_API_URL || "http://nextsafar.local/wp-json";
const fa = (n: number) => n.toLocaleString("fa-IR");

export default async function HotelsSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q: HotelQuery = {
    city: sp.city || "",
    checkIn: sp.checkIn || "",
    checkOut: sp.checkOut || "",
    adults: Math.min(9, Math.max(1, Number(sp.adults) || 1)),
    children: Math.min(6, Math.max(0, Number(sp.children) || 0)),
  };

  const errors = validateHotelQuery(q);

  /* ─── ۱) هتل‌های داخلی (پست‌های وردپرس) ─── */
  let internal: any[] = [];
  if (!errors.length) {
    try {
      const res = await fetch(
        `${WP}/nextsafar/v1/hotels?city=${encodeURIComponent(q.city)}`,
        { next: { revalidate: 60 } },
      );
      if (res.ok) internal = (await res.json()).results || [];
    } catch {
      /* silent */
    }
  }

  /* ─── ) نتایج آنلاین (الان Mock، بعداً API واقعی) ─── */
  const online = errors.length ? [] : await searchHotels(q);

  return (
    <div className="container py-10">
      <h1 className="font-bold mb-2">هتل‌های {q.city}</h1>
      <p className="text-text-muted text-sm mb-8">
        {q.checkIn} تا {q.checkOut} — {fa(q.adults + q.children)} مسافر
      </p>

      {errors.length > 0 && (
        <div className="ns-card p-6 text-center text-danger mb-6">
          پارامترهای نامعتبر: {errors[0]}
        </div>
      )}

      {/* ═══ بخش ۱: هتل‌های داخلی سفر بعدی ═══ */}
      {internal.length > 0 && (
        <section className="mb-10">
          <h2 className="ns-section-title">هتل‌های سفر بعدی در {q.city}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {internal.map((h) => (
              <Link key={h.id} href={h.url} className="ns-card group">
                <div className="relative h-44 overflow-hidden">
                  {h.image ? (
                    <Image
                      src={h.image}
                      alt={h.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-primary-500" />
                    </div>
                  )}
                </div>
                <div className="ns-card-body">
                  <div className="font-bold text-sm mb-1">{h.title}</div>
                  {h.address && (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                      <span className="truncate">{h.address}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ بخش ۲: رزرو آنلاین ═══ */}
      <section>
        <h2 className="ns-section-title">رزرو آنلاین</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {online.map((h) => (
            <div
              key={h.id}
              className="ns-card p-5 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-bold mb-1">{h.name}</div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: h.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </span>
                  <span>امتیاز {h.rating.toLocaleString("fa-IR")}</span>
                  <span>• {fa(h.availableRooms)} اتاق موجود</span>
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className="text-sm font-extrabold text-primary-600">
                  {formatToman(h.pricePerNight)}
                </div>
                <div className="text-xs text-text-muted">هر شب</div>
                <button className="ns-btn ns-btn-primary ns-btn-sm mt-2">
                  رزرو
                </button>
              </div>
            </div>
          ))}
        </div>

        {!errors.length && online.length === 0 && internal.length === 0 && (
          <div className="ns-card p-10 text-center text-text-muted">
            نتیجه‌ای یافت نشد.
          </div>
        )}
      </section>
    </div>
  );
}
