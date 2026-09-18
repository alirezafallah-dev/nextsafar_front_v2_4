import { buildApiUrl } from "./config";
import { MenuItem } from "@/types/menu";

/* ═══ خواندن منو از وردپرس — تحمل‌پذیر برای {items:[…]} یا آرایه خام ═══ */
export async function getMenus(location: string): Promise<MenuItem[]> {
  try {
    const res = await fetch(buildApiUrl(`nextsafar/v1/menus/${location}`), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[menus] ${location} → HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.items ?? []);
    return items as MenuItem[];
  } catch (e) {
    console.warn(`[menus] ${location} fetch error:`, e);
    return [];
  }
}