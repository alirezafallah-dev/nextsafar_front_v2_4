/* ================================================================
   لایه جستجوی آنلاین — Adapter Pattern
   • الان: MockProvider (داده نمونه برای تست ساختار)
   • بعداً: فقط همین یک فایل تغییر می‌کند (رسپینا/فلای‌تودی/جااما/SearchApi)
   • کلیدهای API فقط سمت سرور (env) — هرگز به کلاینت نمی‌رسد
================================================================ */

export interface FlightQuery {
  tripType: "one" | "round";
  origin: string;
  destination: string;
  departDate: string; // YYYY/MM/DD جلالی
  returnDate?: string;
  adults: number;
  children: number;
}

export interface HotelQuery {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNo: string;
  departTime: string;
  arriveTime: string;
  durationMin: number;
  stops: number;
  price: number; // تومان
}

export interface HotelResult {
  id: string;
  name: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  availableRooms: number;
}

export interface FlightProvider {
  search(q: FlightQuery): Promise<FlightResult[]>;
}
export interface HotelProvider {
  search(q: HotelQuery): Promise<HotelResult[]>;
}

/* ---------------- mock determinstic ---------------- */
function hash(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const pick = <T>(arr: T[], seed: number) => arr[seed % arr.length];

const AIRLINES = [
  "ایران‌ایر",
  "ماهان",
  "قشم‌ایر",
  "آتا",
  "ترکیش‌ایرلاینز",
  "امارات",
  "فلای‌دبی",
  "پگاسوس",
];
const HOTEL_NAMES = [
  "هتل بزرگ",
  "پارس بین‌الملل",
  "آزادی پالاس",
  "اسپیناس گلد",
  "لاله پارک",
  "کوروش گرند",
];

class MockFlightProvider implements FlightProvider {
  async search(q: FlightQuery): Promise<FlightResult[]> {
    await new Promise((r) => setTimeout(r, 400)); // شبیه‌سازی شبکه
    const base = hash(q.origin + q.destination + q.departDate);
    return Array.from({ length: 4 + (base % 3) }, (_, i) => {
      const seed = hash(`${base}-${i}`);
      const dep = 6 * 60 + (seed % 16) * 60 + (seed % 4) * 15;
      const dur = 75 + (seed % 5) * 45;
      const arr = (dep + dur) % (24 * 60);
      const fmt = (m: number) =>
        `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      return {
        id: `FL-${seed}`,
        airline: pick(AIRLINES, seed),
        flightNo: String((seed % 900) + 100),
        departTime: fmt(dep),
        arriveTime: fmt(arr),
        durationMin: dur,
        stops: seed % 4 === 0 ? 1 : 0,
        price: 2_400_000 + (seed % 60) * 180_000,
      };
    }).sort((a, b) => a.price - b.price);
  }
}

class MockHotelProvider implements HotelProvider {
  async search(q: HotelQuery): Promise<HotelResult[]> {
    await new Promise((r) => setTimeout(r, 400));
    const base = hash(q.city + q.checkIn);
    return Array.from({ length: 4 + (base % 3) }, (_, i) => {
      const seed = hash(`${base}-${i}`);
      return {
        id: `HT-${seed}`,
        name: `${pick(HOTEL_NAMES, seed)} ${q.city}`,
        stars: 3 + (seed % 3),
        rating: Math.round((7 + (seed % 25) / 10) * 10) / 10,
        pricePerNight: 1_800_000 + (seed % 40) * 250_000,
        availableRooms: 1 + (seed % 6),
      };
    }).sort((a, b) => a.pricePerNight - b.pricePerNight);
  }
}

/* ---------------- تنها نقطه ورود (بعداً سوئیچ به واقعی) ---------------- */
export const flightProvider: FlightProvider = new MockFlightProvider();
export const hotelProvider: HotelProvider = new MockHotelProvider();

export const searchFlights = (q: FlightQuery) => flightProvider.search(q);
export const searchHotels = (q: HotelQuery) => hotelProvider.search(q);

/** تور = پرواز + بررسی موجودی هتل */
export async function searchTours(q: FlightQuery) {
  const [flights, hotels] = await Promise.all([
    flightProvider.search(q),
    hotelProvider.search({
      city: q.destination,
      checkIn: q.departDate,
      checkOut: q.returnDate || q.departDate,
      adults: q.adults,
      children: q.children,
    }),
  ]);
  return { flights, hotels };
}

/* ---------------- اعتبارسنجی (مشترک کلاینت + سرور) ---------------- */
export function validateFlightQuery(q: FlightQuery): string[] {
  const e: string[] = [];
  if (!q.origin.trim()) e.push("مبدا الزامی است");
  if (!q.destination.trim()) e.push("مقصد الزامی است");
  if (q.origin && q.origin === q.destination)
    e.push("مبدا و مقصد نمی‌توانند یکسان باشند");
  if (!q.departDate) e.push("تاریخ رفت الزامی است");
  if (q.tripType === "round" && !q.returnDate) e.push("تاریخ برگشت الزامی است");
  if (q.tripType === "round" && q.returnDate && q.returnDate < q.departDate)
    e.push("تاریخ برگشت قبل از رفت است");
  if (q.adults < 1) e.push("حداقل یک بزرگسال الزامی است");
  return e;
}

export function validateHotelQuery(q: HotelQuery): string[] {
  const e: string[] = [];
  if (!q.city.trim()) e.push("شهر مقصد الزامی است");
  if (!q.checkIn) e.push("تاریخ ورود الزامی است");
  if (!q.checkOut) e.push("تاریخ خروج الزامی است");
  if (q.checkIn && q.checkOut && q.checkOut <= q.checkIn)
    e.push("تاریخ خروج باید بعد از ورود باشد");
  if (q.adults < 1) e.push("حداقل یک بزرگسال الزامی است");
  return e;
}

/* ---------------- فرمترها ---------------- */
export const formatToman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;
export const formatDuration = (m: number) =>
  `${Math.floor(m / 60)}س ${m % 60}د`;
