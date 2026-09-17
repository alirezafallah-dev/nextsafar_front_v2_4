import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Layers } from "lucide-react";
import { getTourismTerms, formatFa } from "@/lib/api/home";

/* ✅ موبایل‑اول: گرید ۲ستونه کاشی‌ها • دسکتاپ: ۴ستونه با کاشی بزرگ اول */
export default async function CollectionsSection() {
  const terms = await getTourismTerms(8);
  if (terms.length === 0) return null;

  return (
    <section className="ns-container py-10 md:py-14">
      {/* هدر */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="ns-section-title !mb-1">سفر بر اساس علاقه</h2>
          <p className="text-xs text-text-muted">کالکشن‌های آماده بر اساس شهرهای توریستی</p>
        </div>
        <Link
          href="/tourism"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition shrink-0"
        >
          همه کالکشن‌ها
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* گرید کاشی‌ها */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
        {terms.map((t, i) => (
          <Link
            key={t.id}
            href={`/tourism/${t.slug}`}
            className={`relative overflow-hidden rounded-2xl group aspect-[4/5] ${
              i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : "md:aspect-[4/5]"
            }`}
          >
            {t.image ? (
              <Image
                src={t.image}
                alt={t.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* فال‌بک بدون تصویر: گرادیان برند */
              <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary-dark/60 to-primary/40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
              <h3 className="text-white font-extrabold text-sm md:text-base leading-6 line-clamp-1">
                {t.name}
              </h3>
              <p className="text-white/70 text-[10px] md:text-xs mt-1 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {formatFa(t.count)} مطلب و مکان
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}