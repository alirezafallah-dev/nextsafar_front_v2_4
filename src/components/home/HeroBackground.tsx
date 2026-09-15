"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_TABS } from "@/lib/constants/hero-images";

export default function HeroBackground({ activeTab }: { activeTab: string }) {
  const [i, setI] = useState(0);

  const activeImages = HERO_TABS[activeTab]?.images ?? [];

  /* چرخش فقط وقتی تب فعال بیش از یک عکس دارد — سوئیچ آنی */
  useEffect(() => {
    setI(0);
    if (activeImages.length < 2) return;
    const t = setInterval(
      () => setI((v) => (v + 1) % activeImages.length),
      6000,
    );
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeImages.length]);

  const activeSrc = activeImages[i % (activeImages.length || 1)];

  /* ⭐ همه عکس‌های همه تب‌ها یک‌جا mount می‌شن
     → سوئیچ تب = تعویض آنی، بدون هیچ فلش یا انتظار لود */
  const unique = Array.from(
    new Set(Object.values(HERO_TABS).flatMap((t) => t.images)),
  );

  return (
    <div className="absolute inset-0">
      {unique.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 ${src === activeSrc ? "opacity-100" : "opacity-0"}`}
          aria-hidden={src !== activeSrc}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={idx === 0}
            sizes="(max-width: 1024px) 100vw, 1280px"
            quality={85}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
