"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  UserCircle,
  Settings,
  LogOut,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn] = useState(false); // TODO: از context واقعی
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {!isLoggedIn ? (
        /* ═══ دکمه ورود / ثبت‌نام ═══ */
        <Link
          href="/account/login"
          className="ns-btn ns-btn-primary !px-4 !py-2.5"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">ورود / ثبت‌نام</span>
        </Link>
      ) : (
        <>
          {/* ═══ دکمه پروفایل ═══ */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-primary-lightest transition-colors cursor-pointer"
            aria-label="منوی کاربری"
            aria-expanded={open}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
              ع
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* ═══ دراپ‌داون ═══ */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full end-0 mt-2 w-60 bg-white rounded-lg shadow-card-hover border border-border overflow-hidden z-50"
              >
                {/* هدر کاربر */}
                <div className="p-4 border-b border-divider bg-gradient-to-br from-primary-lightest to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                      ع
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-text-strong truncate">
                        کاربر نمونه
                      </div>
                      <div
                        className="text-xs text-text-muted truncate"
                        dir="ltr"
                      >
                        user@example.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* منو */}
                <ul className="py-1.5">
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-primary-lightest hover:text-primary-dark transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-primary" />
                      داشبورد
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/bookings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-primary-lightest hover:text-primary-dark transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-primary" />
                      رزروهای من
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-primary-lightest hover:text-primary-dark transition-colors"
                    >
                      <Settings className="w-4 h-4 text-primary" />
                      تنظیمات
                    </Link>
                  </li>
                  <li className="border-t border-divider mt-1 pt-1">
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
