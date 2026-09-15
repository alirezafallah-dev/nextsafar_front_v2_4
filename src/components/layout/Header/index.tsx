"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import MainMenu from "./MainMenu";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import AssistantDrawer from "@/components/assistant/AssistantDrawer";
import { MenuItem } from "@/types/menu";

interface HeaderProps {
  mainMenuItems: MenuItem[];
  secMenuItems: MenuItem[];
}

export default function Header({ mainMenuItems, secMenuItems }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const showSecondRow = scrolled && secMenuItems.length > 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 260);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ هندلر باز کردن مودال
  const handleAiTripClick = () => setShowAssistant(true);
  const handleCloseModal = () => setShowAssistant(false);

  return (
    <>
      <header className="sticky top-3 z-50">
        <div className="max-w-[1280px] mx-auto px-3 md:px-0">
          {/* ═══ سطر اول: هدر اصلی ═══ */}
          <div
            className={`border border-border bg-white transition-all duration-300 ${
              showSecondRow ? "rounded-t-lg rounded-b-none" : "rounded-lg"
            }`}
          >
            <div className="container px-4">
              <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4">
                {/* راست: لوگو */}
                <div className="flex-shrink-0">
                  <Logo size={scrolled ? "sm" : "md"} />
                </div>

                {/* وسط/راست: منوی اصلی */}
                <div
                  className={`hidden lg:flex flex-1 transition-all duration-300 ${
                    scrolled ? "justify-start" : "justify-center"
                  }`}
                >
                  <MainMenu 
                    items={mainMenuItems} 
                    variant="primary" 
                    onAiTripClick={handleAiTripClick} // ✅ پاس هندلر
                  />
                </div>

                {/* چپ: جستجو + کاربر + موبایل */}
                <div className="flex items-center gap-2">
                  {scrolled && <HeaderSearch />}
                  <UserMenu />
                  <MobileMenu 
                    items={mainMenuItems} 
                    onAiTripClick={handleAiTripClick} // ✅ پاس هندلر
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ سطر دوم: منوی دسته‌ها (فقط بعد از اسکرول) ═══ */}
          {showSecondRow && (
            <div className="border border-t-0 border-border bg-surface rounded-b-lg">
              <div className="container px-4">
                <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
                  {secMenuItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      className="px-3 py-1.5 rounded-md text-sm font-medium text-text-muted hover:text-primary-dark hover:bg-primary-lightest transition-colors whitespace-nowrap"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {showAssistant && <AssistantDrawer onClose={() => setShowAssistant(false)} />}

    </>
  );
}