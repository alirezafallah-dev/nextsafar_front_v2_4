import {
  BedDouble,
  MapPin,
  Backpack,
  Stamp,
  BookOpen,
  Headphones,
} from "lucide-react";
import { getSiteStats } from "@/lib/api/stats";
import CountUp from "./CountUp";

export default async function StatsBar() {
  const s = await getSiteStats();

  /* ❌ بدون فیلتر — همه ۶ سلول همیشه نمایش داده می‌شن */
  const items = [
    { icon: BedDouble, value: s.hotel ?? 0, label: "هتل و اقامتگاه" },
    { icon: MapPin, value: s.destination ?? 0, label: "مقصد گردشگری" },
    { icon: Backpack, value: s.tour ?? 0, label: "تور فعال" },
    { icon: Stamp, value: s.visa ?? 0, label: "خدمات ویزا" },
    { icon: BookOpen, value: s.travelguide ?? 0, label: "راهنمای سفر" },
    { icon: Headphones, value: -1, label: "پشتیبانی ۲۴/۷" },
  ];

  return (
    <section className="ns-container mt-10 md:mt-14">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white p-5 md:p-6 text-center hover:bg-primary-lightest/40 transitions-all duration-200"
            >
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xl md:text-2xl  text-text-strong tracking-tight">
                {item.value === -1 ? (
                  <span dir="ltr">۲۴/۷</span>
                ) : item.value > 0 ? (
                  <>
                    <CountUp value={item.value} />+
                  </>
                ) : (
                  <span className="text-text-subtle">—</span>
                )}
              </div>
              <div className="text-xs text-text-muted mt-1 font-medium">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
