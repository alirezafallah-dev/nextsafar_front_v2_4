import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Newspaper } from "lucide-react";
import { getGuidePosts, getNewsPosts, formatFaDate } from "@/lib/api/home";

/* ✅ موبایل‑اول: مجله = کارت ویژه + لیست فشرده • اخبار = کاروسل چیپسی */
export default async function MagazineSection() {
  const [guides, news] = await Promise.all([getGuidePosts(4), getNewsPosts(6)]);
  if (guides.length === 0 && news.length === 0) return null;

  const [feature, ...restGuides] = guides;

  return (
    <section className="ns-container py-10 md:py-14">
      {/* ═══ مجله سفر ═══ */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="ns-section-title !mb-1">مجله سفر</h2>
          <p className="text-xs text-text-muted">راهنماها و تجربه‌های خواندنی تیم نکست‌سفر</p>
        </div>
        <Link
          href="/travel-guides"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition shrink-0"
        >
          همه مطالب
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-3 md:gap-6">
        {/* کارت ویژه */}
        {feature && (
          <Link
            href={`/travel-guides/${feature.slug}`}
            className="relative overflow-hidden rounded-2xl group aspect-[16/10] md:aspect-auto md:min-h-[320px]"
          >
            {feature.image ? (
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              {feature.category && (
                <span className="inline-block px-2 py-1 rounded-lg bg-primary text-white text-[9px] font-bold mb-2">
                  {feature.category}
                </span>
              )}
              <h3 className="text-white font-extrabold text-base md:text-xl leading-7 md:leading-8 line-clamp-2">
                {feature.title}
              </h3>
              {feature.excerpt && (
                <p className="text-white/70 text-[11px] md:text-xs leading-6 mt-2 line-clamp-2">
                  {feature.excerpt}
                </p>
              )}
            </div>
          </Link>
        )}

        {/* لیست فشرده */}
        <div className="flex flex-col divide-y divide-divider">
          {restGuides.map((g) => (
            <Link
              key={g.id}
              href={`/travel-guides/${g.slug}`}
              className="flex items-center gap-3 py-3 group"
            >
              <div className="relative w-20 h-16 md:w-24 md:h-18 rounded-xl overflow-hidden shrink-0 bg-bg-sec">
                {g.image ? (
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-text-muted/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs md:text-sm font-bold leading-6 line-clamp-2 group-hover:text-primary transition">
                  {g.title}
                </h4>
                <p className="text-[10px] text-text-muted mt-1">
                  {g.category ?? "راهنمای سفر"}
                  {g.date ? ` • ${formatFaDate(g.date)}` : ""}
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ آخرین اخبار ═══ */}
      {news.length > 0 && (
        <>
          <div className="flex items-end justify-between mt-10 md:mt-14 mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-primary" />
              <h3 className="text-sm md:text-base font-extrabold">آخرین اخبار گردشگری</h3>
            </div>
            <Link
              href="/travel-news"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition shrink-0"
            >
              همه اخبار
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* کاروسل چیپسی موبایل / گرید دسکتاپ */}
          <div className="-mx-4 px-4 flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-2 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/travel-news/${n.slug}`}
                className="w-[78%] sm:w-[52%] md:w-auto shrink-0 snap-start rounded-xl border border-border bg-white p-3 md:p-4 hover:border-primary/40 hover:shadow-card-hover transition group"
              >
                <p className="text-[9px] font-bold text-primary mb-1.5">
                  {n.category ?? "خبر گردشگری"}
                  {n.date ? ` • ${formatFaDate(n.date)}` : ""}
                </p>
                <h4 className="text-[11px] md:text-xs font-bold leading-6 line-clamp-2 group-hover:text-primary transition">
                  {n.title}
                </h4>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}