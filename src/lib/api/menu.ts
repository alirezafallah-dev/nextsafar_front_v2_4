import { MenuItem } from "@/types/menu";

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || "http://nextsafar.local/wp-json";

const menuCache = new Map<string, { items: MenuItem[]; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // ۱ ساعت

export async function getMenus(
  location: "mainmenu" | "secmenu",
): Promise<MenuItem[]> {
  const cached = menuCache.get(location);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.items;
  }

  try {
    const res = await fetch(`${WP_API_URL}/nextsafar/v1/menus/${location}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return getFallbackMenu(location);
    }

    const data = await res.json();
    const items = data.items || [];

    menuCache.set(location, { items, timestamp: Date.now() });
    return items;
  } catch (error) {
    return getFallbackMenu(location);
  }
}

function getFallbackMenu(location: string): MenuItem[] {
  if (location === "mainmenu") {
    return [
      { id: 1, title: "صفحه اصلی", url: "/" },
      { id: 2, title: "هتل‌ها", url: "/hotels" },
      { id: 3, title: "تورها", url: "/tours" },
      { id: 4, title: "ویزا", url: "/visa" },
      { id: 5, title: "پرواز", url: "/flights" },
    ];
  }
  return [
    { id: 101, title: "اخبار", url: "/news" },
    { id: 102, title: "راهنمای سفر", url: "/travelguide" },
    { id: 103, title: "مقاصد", url: "/destinations" },
  ];
}
