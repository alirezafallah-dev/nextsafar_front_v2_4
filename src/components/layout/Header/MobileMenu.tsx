"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MobileMenuProps {
  items: MenuItem[];
  onAiTripClick?: () => void; // ✅ پروپ جدید
}

export default function MobileMenu({ items, onAiTripClick }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleAiTripClick = () => {
    handleClose();
    onAiTripClick?.();
  };

  return (
    <>
      {/* دکمه همبرگر */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-text-muted hover:text-primary-dark hover:bg-primary-lightest/50 transition"
        aria-label="منو"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* پنل منو */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h2 className="font-bold text-lg">منو</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-bg-sec transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={handleClose}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-text hover:bg-primary-lightest/50 hover:text-primary-dark transition"
                >
                  {item.title}
                </Link>
              ))}

              {/* ✅ آیتم سفر هوشمند */}
              <button
                type="button"
                onClick={handleAiTripClick}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-base font-medium text-text hover:bg-primary-lightest/50 hover:text-primary-dark transition"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span>سفر هوشمند</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}