import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BadgeCheck, FileText } from "lucide-react";
import { getVisaPosts } from "@/lib/api/home";

/* ✅ موبایل‑اول: کاروسل snap افقی با peek • دسکتاپ: گرید ۴ستونه */
export default async function VisaSection() {
  const visas = await getVisaPosts(8);
  if (visas.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-bg-sec/60">
      {/* هدر */}
      <div className="ns-container flex items-end justify-between mb-6">
        <div>
          <h2 className="ns-section-title !mb-1">خدمات ویزا</h2>
          <p className="text-xs text-text-muted">راهنما، مدارک و شرایط جدید انواع ویزا</p>
        </div>
        <Link
          href="/visas"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition shrink-0"
        >
          همه ویزاها
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* کاروسل موبایل / گرید دسکتاپ */}
      <div className="ns-container">
        <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visas.map((v) => (
            <Link
              key={v.id}
              href={`/visas/${v.slug}`}
              className="w-[70%] sm:w-[46%] md:w-auto shrink-0 snap-start ns-card overflow-hidden group"
            >
              {/* تصویر */}
              <div className="relative aspect-[16/10] bg-bg-sec">
                {v.image ? (
                  <Image
                    src={v.image}
                    alt={v.title}
                    fill
                    sizes="(max-width: 768px) 70vw, (max-width: 1024px) 46vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-text-muted/40" />
                  </div>
                )}
                {v.category && (
                  <span className="absolute top-2 start-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold">
                    {v.category}
                  </span>
                )}
              </div>

              {/* بدنه */}
              <div className="p-3 md:p-4">
                <h3 className="text-xs md:text-sm font-extrabold leading-6 line-clamp-2 group-hover:text-primary transition">
                  {v.title}
                </h3>
                {v.excerpt && (
                  <p className="text-[10px] md:text-xs text-text-muted leading-5 mt-2 line-clamp-2">
                    {v.excerpt}
                  </p>
                )}
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary mt-3">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  بررسی شرایط
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}