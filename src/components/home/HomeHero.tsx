"use client";

import { useState } from "react";
import { ShieldCheck, Zap, Headphones } from "lucide-react"; // ✅ FIX #2: حذف Sparkles استفاده‌نشده
import SearchWidget from "./SearchWidget";
import HeroBackground from "./HeroBackground";
import { HERO_TABS, HERO_FALLBACK } from "@/lib/constants/hero-images";

export default function HomeHero() {
  const [tabId, setTabId] = useState("flight");

  /* ✅ FIX #3: fallback امن اگر تب در HERO_TABS نبود */
  const tab = HERO_TABS[tabId] ?? HERO_FALLBACK;

  return (
    <section className="ns-container pt-5 md:pt-7">
      {/* ═══ کارت تصویر ═══ */}
      <div className="relative rounded-lg md:rounded-2xl overflow-hidden h-[340px] md:h-[500px] isolate bg-gradient-to-b from-[#0b1e3a] to-[#123a6b]">
        <HeroBackground activeTab={tabId} />

        <div className="absolute top-0 start-0 z-10 p-5 md:p-8 max-w-2xl text-start">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 leading-tight [text-shadow:_0_2px_16px_rgba(0,0,0,0.65)]">
            {tab.title}
          </h1>
          <p className="text-sm md:text-lg text-white/95 [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)]">
            {tab.subtitle}
          </p>
        </div>
      </div>

      {/* ═══ کارت جستجو - شناور روی لبه تصویر ═══ */}
      <div className="relative z-20 -mt-24 md:-mt-28 px-3 md:px-8">
        <SearchWidget activeTab={tabId} onTabChange={setTabId} float />
      </div>

      {/* ═══ ردیف اعتماد ═══ */}
      <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-text-muted text-xs md:text-sm">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" /> پرداخت امن
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> صدور آنی واچر
        </span>
        <span className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-primary" /> پشتیبانی ۲۴/۷
        </span>
      </div>
    </section>
  );
}