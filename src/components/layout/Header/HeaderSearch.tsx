"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ رفع ارور Link is not defined
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  MapPin,
  Plane,
  BedDouble,
  UtensilsCrossed,
  Stamp,
  Backpack,
  BookOpen,
  Newspaper,
  ArrowLeft,
  Stethoscope,
  Shield,
  Sparkles,
} from "lucide-react";

const WP =
  process.env.NEXT_PUBLIC_WP_API_URL || "http://nextsafar.local/wp-json";

/* ═══ متادیتای پست‌تایپ‌ها (آیکن + لیبل + مسیر) ═══ */
const TYPE_META: Record<string, { label: string; icon: any; base: string }> = {
  hotel: { label: "هتل", icon: BedDouble, base: "/hotels" },
  destination: { label: "مقاصد", icon: MapPin, base: "/destinations" },
  restaurant: { label: "رستوران", icon: UtensilsCrossed, base: "/restaurants" },
  airport: { label: "فرودگاه", icon: Plane, base: "/airports" },
  visa: { label: "ویزا", icon: Stamp, base: "/visa" },
  tour: { label: "تور", icon: Backpack, base: "/tours" },
  travelguide: { label: "راهنمای سفر", icon: BookOpen, base: "/travelguide" },
  travelnews: { label: "اخبار", icon: Newspaper, base: "/news" },
  hospital: { label: "بیمارستان", icon: Stethoscope, base: "/hospitals" },
  insurance: { label: "بیمه مسافرتی", icon: Shield, base: "/insurance" },
  cip: { label: "خدمات CIP", icon: Sparkles, base: "/cip" },
};

interface SearchResult {
  id: number;
  type: string;
  title: string;
  url: string;
  image?: string | null;
  address?: string | null;
}

/* ═══ fallback بدون پلاگین ═══ */
async function fallbackSearch(term: string): Promise<SearchResult[]> {
  const all = await Promise.all(
    Object.entries(TYPE_META).map(async ([type, meta]) => {
      try {
        const r = await fetch(
          `${WP}/wp/v2/${type}?search=${encodeURIComponent(term)}&per_page=3&_embed`,
        );
        if (!r.ok) return [] as SearchResult[];
        const data = await res2json(r);
        return data.map(
          (p: any): SearchResult => ({
            id: p.id,
            type,
            title: (p.title?.rendered || "").replace(/<[^>]+>/g, "").trim(),
            url: `${meta.base}/${p.slug}`,
            image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
            address: null,
          }),
        );
      } catch {
        return [] as SearchResult[];
      }
    }),
  );
  return dedupe(all.flat()).slice(0, 12);
}

async function res2json(r: Response) {
  return r.json();
}

const QUICK_SUGGESTIONS = [
  "دبی",
  "استانبول",
  "هتل آنتالیا",
  "ویزای دبی",
  "تور ترکیه",
];

/* ═══ حذف نتایج تکراری ═══ */
function dedupe(list: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return list.filter((r) => {
    const key = `${r.type}-${r.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ─── بستن با کلیک بیرون ─── */
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  /* ─── فوکوس روی اینپوت ─── */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  /* ─── جستجو با debounce ─── */
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `${WP}/nextsafar/v1/search?q=${encodeURIComponent(term)}&per_type=3`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(dedupe(data.results || []));
        } else {
          setResults(dedupe(await fallbackSearch(term)));
        }
      } catch {
        try {
          setResults(dedupe(await fallbackSearch(term)));
        } catch {
          setResults([]);
        }
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const submitAll = () => {
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={ref} className="relative">
      {/* ═══ باکس جستجو ═══ */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 h-11 w-40 md:w-52 px-3 rounded-sm border text-sm transition-all cursor-pointer ${
          open
            ? "opacity-0 pointer-events-none"
            : "border-border bg-surface hover:border-primary-light hover:bg-white"
        }`}
        aria-label="جستجو در سایت"
      >
        <Search className="w-4 h-4 text-primary shrink-0" />
        <span className="text-text-subtle truncate">جستجو در سفر بعدی...</span>
      </button>

      {/* ═══ پنل: دقیقاً روی خود فرم + بزرگ‌شدن از سمت راست ═══ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute top-0 end-0 w-[min(92vw,600px)] bg-white rounded-md border border-border shadow-card-hover overflow-hidden z-50"
          >
            {/* ─── ردیف اینپوت (هم‌ارتفاع باکس = جایگزین آن) ─── */}
            <div className="flex items-center gap-2.5 px-3 h-10 border-b border-divider">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitAll();
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="جستجو در هتل، تور، ویزا، مقاصد، فرودگاه..."
                className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-subtle"
              />
              {loading && (
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              )}
            </div>

            {/* ─── پیشنهادهای سریع ─── */}
            {q.trim().length < 2 && (
              <div className="p-4">
                <div className="text-xs font-bold text-text-muted mb-2.5">
                  جستجوهای پرطرفدار:
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQ(s)}
                      className="ns-chip !py-1.5 !text-xs hover:!border-primary hover:!text-primary-dark cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── نتایج ─── */}
            {q.trim().length >= 2 && (
              <ul className="max-h-[380px] overflow-y-auto py-1">
                {results.length === 0 && !loading && (
                  <li className="px-4 py-8 text-center text-sm text-text-muted">
                    نتیجه‌ای برای «{q}» یافت نشد
                  </li>
                )}
                {results.map((r) => {
                  const meta = TYPE_META[r.type];
                  const Icon = meta?.icon || Search;
                  return (
                    <li key={`${r.type}-${r.id}`}>
                      <Link
                        href={r.url}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-lightest/60 transition-colors"
                      >
                        {r.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={r.image}
                            alt=""
                            className="w-12 h-12 rounded-md object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-primary-lightest text-primary-dark flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-text truncate">
                            {r.title}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                            {r.address ? (
                              <>
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="truncate">{r.address}</span>
                              </>
                            ) : (
                              <span>{meta?.label || ""}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* ─── فوتر ─── */}
            <div className="border-t border-divider bg-surface/60">
              <button
                type="button"
                onClick={submitAll}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-primary-dark hover:bg-primary-lightest transition-colors cursor-pointer"
              >
                مشاهده همه نتایج برای «{q || "..."}»
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
