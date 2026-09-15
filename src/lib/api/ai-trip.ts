import type { TripInput, TripPlan } from "@/types/ai-trip";

/** پاسخ اولیه ساخت برنامه */
export interface GenerateResponse {
  success: boolean;
  plan_id: number;
  status: "pending" | "completed";
  message?: string;
  cached?: boolean;
  plan?: TripPlan;
  remaining_today?: number;
}

/** شهر برای اتوکامپلیت مقصد */
export interface CityItem {
  city: string;
  country: string;
}

/**
 * ساخت برنامه سفر جدید
 * اگر کش وجود داشته باشد، مستقیم `completed` برمی‌گردد
 * @throws Error با پیام فارسی مناسب نمایش
 */
export async function generateTripPlan(
  input: TripInput
): Promise<GenerateResponse> {
  const res = await fetch("/api/ai-trip/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "خطایی رخ داد. دوباره تلاش کن.");
  }
  return data;
}

/**
 * دریافت وضعیت برنامه (برای پولینگ)
 */
export async function getTripPlanStatus(planId: number): Promise<TripPlan> {
  const res = await fetch(`/api/ai-trip/plan/${planId}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "خطا در دریافت وضعیت برنامه");
  }
  return data;
}

/**
 * دریافت لیست شهرها برای اتوکامپلیت مقصد
 */
export async function getDestinations(): Promise<CityItem[]> {
  try {
    const res = await fetch("/api/ai-trip/destinations");
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}