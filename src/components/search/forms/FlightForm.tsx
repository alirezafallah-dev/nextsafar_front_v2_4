"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CityPicker,
  CityValue,
  DateRangePicker,
  DateRangeValue,
  Field,
  PassengerPicker,
  SwapButton,
  todayJalali,
} from "../fields";

export default function FlightForm({
  mode = "flight",
  tripType = "one",
  cabin = "economy",
}: {
  mode?: "flight" | "tour";
  tripType?: "one" | "round";
  cabin?: string;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState<CityValue | null>(null);
  const [dest, setDest] = useState<CityValue | null>(null);
  const [dates, setDates] = useState<DateRangeValue>({});
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [error, setError] = useState("");

  /* اگر نوع سفر به یک‌طرفه تغییر کرد، تاریخ برگشت پاک شود */
  useEffect(() => {
    if (tripType === "one") {
      setDates((d) => ({ from: d.from, to: undefined }));
    }
  }, [tripType]);

const submit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const today = todayJalali();

  /* ═══ اعتبارسنجی با return زودهنگام ═══ */
  if (!origin) {
    setError("مبدا را انتخاب کنید");
    return;
  }
  if (!dest) {
    setError("مقصد را انتخاب کنید");
    return;
  }
  if (origin.code === dest.code) {
    setError("مبدا و مقصد یکسان است");
    return;
  }
  if (!dates.from) {
    setError("تاریخ رفت الزامی است");
    return;
  }
  if (dates.from < today) {
    setError("تاریخ رفت نمی‌تواند در گذشته باشد");
    return;
  }
  if (tripType === "round") {
    if (!dates.to) {
      setError("تاریخ برگشت الزامی است");
      return;
    }
    if (dates.to < dates.from) {
      setError("برگشت نمی‌تواند قبل از رفت باشد");
      return;
    }
  }
  if (adults < 1) {
    setError("حداقل یک بزرگسال الزامی است");
    return;
  }

  /* ═══ از اینجا به بعد همه مقادیر تعریف‌شده هستند ═══ */
  const p = new URLSearchParams({
    tripType,
    cabin,
    origin: origin.label,
    originCode: origin.code || "",
    destination: dest.label,
    destCode: dest.code || "",
    departDate: dates.from,
    adults: String(adults),
    children: String(kids),
  });

  if (tripType === "round" && dates.to) p.set("returnDate", dates.to);

  router.push(`/${mode === "tour" ? "tours" : "flights"}?${p.toString()}`);
};

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="مبدا" className="flex-1 min-w-[170px]">
          <CityPicker
            source="airports"
            value={origin}
            onChange={setOrigin}
            placeholder="مبدا (شهر / فرودگاه)"
          />
        </Field>

        <SwapButton
          onSwap={() => {
            setOrigin(dest);
            setDest(origin);
          }}
        />

        <Field label="مقصد" className="flex-1 min-w-[170px]">
          <CityPicker
            source="airports"
            value={dest}
            onChange={setDest}
            placeholder="مقصد (شهر / فرودگاه)"
          />
        </Field>

        <div className="flex-1 min-w-[280px]">
          <DateRangePicker
            value={dates}
            onChange={setDates}
            allowRange={tripType === "round"}
            fromName="تاریخ رفت"
            toName="تاریخ برگشت"
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
          {mode === "tour" ? "جستجو" : "جستجو"}
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
