"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  Dumbbell,
  Globe2,
  MapPin,
  Sparkles,
  Star,
  Utensils,
  Waves,
  Wifi,
  Wine,
} from "lucide-react";

export interface FeaturedHotel {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  stars: number | null;
  rating: number | null;
  city: string | null;
  country: string | null;
  amenities: string[];
  url: string;
}

/* ═══ نگاشت amenity → آیکون ═══ */
const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi,
  اینترنت: Wifi,
  وای‌فای: Wifi,
  استخر: Waves,
  pool: Waves,
  رستوران: Utensils,
  restaurant: Utensils,
  اسپا: Bath,
  spa: Bath,
  باشگاه: Dumbbell,
  gym: Dumbbell,
  بار: Wine,
  bar: Wine,
};

function getAmenityIcon(name: string) {
  const key = name.toLowerCase().trim();
  for (const [k, Icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return Sparkles;
}

/* ═══════════════════════════════════════════════════════════
   کارت بزرگ (Featured اصلی)
═══════════════════════════════════════════════════════════ */
function BigCard({ hotel }: { hotel: FeaturedHotel }) {
  return (
    <Link
      href={hotel.url}
      className="group relative block w-full h-full overflow-hidden rounded-lg border border-border hover:shadow-card-hover hover:border-primary-light transition-all duration-500 ease-out min-h-[400px] md:min-h-0"
    >
      {hotel.image ? (
        <Image
          src={hotel.image}
          alt={hotel.title}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          quality={90}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-lightest via-white to-primary-light" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* ⭐ بج آبی «منتخب سفر بعدی» */}
      <div className="absolute top-4 start-4 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-primary-dark text-white text-[11px] font-extrabold shadow-lg">
          <Star className="w-3 h-3 fill-white" />
          <span>منتخب سفر بعدی</span>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 z-10">
        {/* ستاره‌ها */}
        {hotel.stars && (
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
        )}

        <h3 className="text-white font-extrabold text-xl md:text-2xl mb-2 drop-shadow-lg line-clamp-2">
          {hotel.title}
        </h3>

        {/* ⭐ کشور + شهر */}
        {(hotel.country || hotel.city) && (
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {hotel.country && (
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <Globe2 className="w-4 h-4" />
                <span>{hotel.country}</span>
              </div>
            )}
            {hotel.country && hotel.city && (
              <span className="text-white/40">•</span>
            )}
            {hotel.city && (
              <div className="flex items-center gap-1.5 text-white/85 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{hotel.city}</span>
              </div>
            )}
          </div>
        )}

        {/* amenities */}
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, i) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div
                  key={i}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold"
                >
                  <Icon className="w-3 h-3" />
                  <span>{amenity}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="group-hover:text-primary-light transition-colors">
            مشاهده و رزرو
          </span>
          <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   کارت کوچک (Featured فرعی)
═══════════════════════════════════════════════════════════ */
function SmallCard({ hotel }: { hotel: FeaturedHotel }) {
  return (
    <Link
      href={hotel.url}
      className="group relative block w-full h-full overflow-hidden rounded-lg border border-border hover:shadow-card-hover hover:border-primary-light transition-all duration-500 ease-out min-h-[200px] md:min-h-0"
    >
      {hotel.image ? (
        <Image
          src={hotel.image}
          alt={hotel.title}
          fill
          sizes="(max-width: 1024px) 100vw, 300px"
          quality={85}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-lightest via-white to-primary-light" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* ⭐ بج کوچک آبی */}
      <div className="absolute top-3 start-3 z-10">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-primary to-primary-dark text-white text-[10px] font-extrabold shadow">
          <Star className="w-2.5 h-2.5 fill-white" />
          <span>منتخب</span>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 z-10">
        {hotel.stars && (
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
        )}

        <h3 className="text-white font-extrabold text-sm md:text-[15px] drop-shadow line-clamp-1 mb-1.5">
          {hotel.title}
        </h3>

        {/* ⭐ کشور + شهر در کارت کوچک */}
        <div className="flex items-center gap-2 text-white/80 text-xs flex-wrap">
          {hotel.country && (
            <span className="flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              <span className="truncate">{hotel.country}</span>
            </span>
          )}
          {hotel.country && hotel.city && (
            <span className="text-white/40">•</span>
          )}
          {hotel.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{hotel.city}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   کامپوننت اصلی Bento
═══════════════════════════════════════════════════════════ */
export default function FeaturedHotelsClient({
  hotels,
}: {
  hotels: FeaturedHotel[];
}) {
  if (hotels.length === 0) return null;

  const [first, ...rest] = hotels;
  const smallOnes = rest.slice(0, 4);

  return (
    <section className="ns-container mt-14 md:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {/* <Star className="w-5 h-5 text-primary fill-primary" /> */}
            <h2 className="ns-section-title !mb-0">هتل‌های منتخب</h2>
          </div>
          <p className="text-sm text-text-muted">
            انتخاب ویژه تیم سفر بعدی برای اقامتی بی‌نظیر
          </p>
        </div>
        <Link
          href="/hotels"
          className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-white text-xs font-bold text-text-muted hover:border-primary hover:text-primary-dark transition"
        >
          مشاهده همه هتل‌ها
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 h-auto md:h-[380px]">
        {/* کارت بزرگ */}
        <div className="md:col-span-2 h-[400px] md:h-full">
          <BigCard hotel={first} />
        </div>

        {/* کارت‌های کوچک — grid 2 ستونه در موبایل */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-5 md:h-full">
          {smallOnes.length > 0 ? (
            smallOnes.map((h) => (
              <div key={h.id} className="h-[200px] md:h-auto md:flex-1">
                <SmallCard hotel={h} />
              </div>
            ))
          ) : (
            <Link
              href="/hotels"
              className="relative flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-border bg-bg-sec/30 p-6 hover:border-primary hover:bg-primary-lightest/30 transition h-full min-h-[200px]"
            >
              <Star className="w-10 h-10 text-primary fill-primary mb-2" />
              <div className="font-bold text-text-strong mb-1">
                هتل‌های بیشتری در راه است
              </div>
              <div className="text-xs text-text-muted">
                به‌زودی هتل‌های برگزیده جدید اضافه می‌شود
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
