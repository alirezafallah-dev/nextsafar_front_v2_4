"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CityPicker,
  CityValue,
  DateRangePicker,
  DateRangeValue,
  Field,
  PassengerPicker,
  todayJalali,
} from "../fields";

export default function HotelForm() {
  const router = useRouter();
  const [city, setCity] = useState<CityValue | null>(null);
  const [dates, setDates] = useState<DateRangeValue>({});
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = todayJalali();
    const errs: string[] = [];

    if (!city) errs.push("شهر مقصد را انتخاب کنید");
    if (!dates.from) errs.push("تاریخ ورود الزامی است");
    else if (dates.from < today)
      errs.push("تاریخ ورود نمی‌تواند در گذشته باشد");
    if (!dates.to) errs.push("تاریخ خروج الزامی است");
    else if (dates.from && dates.to <= dates.from)
      errs.push("تاریخ خروج باید بعد از ورود باشد");
    if (adults < 1) errs.push("حداقل یک بزرگسال الزامی است");

    if (errs.length) {
      setError(errs[0]);
      return;
    }
    setError("");

    const p = new URLSearchParams({
      city: city!.label,
      checkIn: dates.from!,
      checkOut: dates.to!,
      adults: String(adults),
      children: String(kids),
    });
    router.push(`/hotels/search?${p.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="شهر مقصد" className="flex-1 min-w-[200px]">
          <CityPicker
            source="cities"
            value={city}
            onChange={setCity}
            placeholder="کجا اقامت می‌گیرید؟"
          />
        </Field>

        <div className="flex-1 min-w-[280px]">
          <DateRangePicker
            value={dates}
            onChange={setDates}
            allowRange={true}
            fromName="تاریخ ورود"
            toName="تاریخ خروج"
          />
        </div>

        <Field label="مسافران" className="w-[190px]">
          <PassengerPicker
            adults={adults}
            children={kids}
            onChange={(a, c) => {
              setAdults(a);
              setKids(c);
            }}
          />
        </Field>

        <button type="submit" className="ns-btn ns-btn-primary h-[48px]">
          <Search className="w-4 h-4" />
          جستجو
        </button>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </form>
  );
}
