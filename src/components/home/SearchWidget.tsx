"use client";

import { useState } from "react";
import {
  Backpack,
  BedDouble,
  BookOpen,
  MapPin,
  Plane,
  PlaneTakeoff,
  Stamp,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import FlightForm from "@/components/search/forms/FlightForm";
import HotelForm from "@/components/search/forms/HotelForm";
import TourForm from "@/components/search/forms/TourForm";
import ContentForm from "@/components/search/forms/ContentForm";
import { TripTypeToggle } from "@/components/search/fields";

/* ═══ تایپ تب‌ها (تب برنامه سفر حذف شد) ═══ */
type TabDef =
  | { id: string; label: string; icon: any; kind: "booking" }
  | {
      id: string;
      label: string;
      icon: any;
      kind: "content";
      postType: string;
      basePath: string;
      ph: string;
    };

const TABS: TabDef[] = [
  { id: "flight", label: "پرواز", icon: Plane, kind: "booking" },
  { id: "hotel", label: "هتل", icon: BedDouble, kind: "booking" },
  { id: "tour", label: "تور", icon: Backpack, kind: "booking" },
  {
    id: "destination",
    label: "مقاصد",
    icon: MapPin,
    kind: "content",
    postType: "destination",
    basePath: "/destinations",
    ph: "جستجوی مقاصد و جاذبه‌ها...",
  },
  {
    id: "visa",
    label: "ویزا",
    icon: Stamp,
    kind: "content",
    postType: "visa",
    basePath: "/visa",
    ph: "جستجوی شرایط و مدارک ویزا...",
  },
  {
    id: "restaurant",
    label: "رستوران",
    icon: UtensilsCrossed,
    kind: "content",
    postType: "restaurant",
    basePath: "/restaurants",
    ph: "جستجوی رستوران و کافه...",
  },
  {
    id: "airport",
    label: "فرودگاه",
    icon: PlaneTakeoff,
    kind: "content",
    postType: "airport",
    basePath: "/airports",
    ph: "جستجوی اطلاعات فرودگاه‌ها...",
  },
  {
    id: "hospital",
    label: "بیمارستان",
    icon: Stethoscope,
    kind: "content",
    postType: "hospital",
    basePath: "/hospitals",
    ph: "جستجوی بیمارستان و مراکز درمانی...",
  },
  {
    id: "travelguide",
    label: "راهنمای سفر",
    icon: BookOpen,
    kind: "content",
    postType: "travelguide",
    basePath: "/travelguide",
    ph: "جستجوی راهنمای سفر...",
  },
];

interface SearchWidgetProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  float?: boolean;
}

export default function SearchWidget({
  activeTab,
  onTabChange,
  float = false,
}: SearchWidgetProps) {
  const [internalTab, setInternalTab] = useState("flight");
  const [tripType, setTripType] = useState<"one" | "round">("one");

  const tabId = activeTab ?? internalTab;

  const setTabId = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  /* ✅ fallback امن به جای non-null assertion */
  const tab = TABS.find((t) => t.id === tabId) ?? TABS[0];

  /* ✅ جداکننده بین تب‌های رزروی و محتوا (بر اساس kind، نه ایندکس) */
  const firstContentId = TABS.find((t) => t.kind === "content")?.id;

  return (
    <div className="w-full mx-auto">
      {/* ═══ سطر تب‌ها ═══ */}
      <div className="relative mb-3">
        <div className="mx-auto w-fit max-w-full overflow-x-auto scrollbar-hide">
          <div
            role="tablist"
            aria-label="جستجوی خدمات سفر"
            className="flex items-center gap-0.5 bg-white rounded-lg shadow-sm border border-border p-1.5"
          >
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.id === tabId;

              return (
                <span key={t.id} className="flex items-center">
                  {t.id === firstContentId && (
                    <span className="w-px h-6 bg-border mx-1.5 shrink-0" />
                  )}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTabId(t.id)}
                    className={`flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-md text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-white shadow-md"
                        : "text-text-muted hover:text-primary-dark hover:bg-primary-lightest"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ کارت فرم ═══ */}
      <div
        role="tabpanel"
        className={
          float
            ? "bg-white rounded-xl shadow-sm ring-1 ring-black/5 border border-border p-4 md:p-5"
            : "bg-white rounded-lg shadow-sm border border-border p-4 md:p-5"
        }
      >
        {/* تاگل نوع سفر — فقط تب پرواز */}
        {tab.id === "flight" && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-divider">
            <TripTypeToggle value={tripType} onChange={setTripType} />
            <span className="hidden md:block text-xs text-text-muted">
              💡 قیمت‌ها لحظه‌ای استعلام می‌شوند
            </span>
          </div>
        )}

        {tab.id === "flight" && <FlightForm tripType={tripType} />}
        {tab.id === "hotel" && <HotelForm />}
        {tab.id === "tour" && <TourForm />}

        {tab.kind === "content" && (
          <ContentForm
            postType={tab.postType}
            basePath={tab.basePath}
            placeholder={tab.ph}
            icon={tab.icon}
            typeLabel={tab.label}
          />
        )}
      </div>
    </div>
  );
}