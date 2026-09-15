import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPosts } from "@/lib/api/wordpress";
import StoriesCarousel, { StoryItem } from "./StoriesCarousel";
import { getBestImageUrl, IMG_TARGETS } from "@/lib/utils/image";

/* ═══ استخراج هوشمند نام مکان ═══ */
function extractPlace(post: any): string {
  const cats = post._embedded?.["wp:term"]?.[0];
  if (cats && cats.length > 0) {
    return cats[0].name || "";
  }

  const acf = post.acf || {};
  const meta = post.meta || {};
  if (acf.country) return acf.country;
  if (acf.city) return acf.city;
  if (meta.country) return meta.country;
  if (meta.city) return meta.city;

  const title = (post.title?.rendered || "").replace(/<[^>]+>/g, "").trim();
  const knownCities = [
    "استانبول",
    "دبی",
    "کیش",
    "مشهد",
    "شیراز",
    "اصفهان",
    "تهران",
    "آنتالیا",
    "بالی",
    "تفلیس",
    "باتومی",
    "پاریس",
    "رم",
    "بارسلونا",
    "Istanbul",
    "Dubai",
    "Kish",
    "Mashhad",
    "Shiraz",
    "Isfahan",
    "Tehran",
  ];
  for (const city of knownCities) {
    if (title.includes(city)) return city;
  }

  return "";
}

export default async function DestinationStories() {
  let items: StoryItem[] = [];

  try {
    const posts = await getPosts("destination", { per_page: 12 });
    items = posts
      .map((p: any) => {
        const media = p._embedded?.["wp:featuredmedia"]?.[0];
        return {
          slug: p.slug,
          title: (p.title?.rendered || "").replace(/<[^>]+>/g, "").trim(),
          image: getBestImageUrl(media, IMG_TARGETS.story),
          place: extractPlace(p),
        };
      })
      .filter((i: StoryItem) => i.image && i.title);
  } catch (err) {
    console.error("DestinationStories error:", err);
    items = [];
  }

  if (items.length === 0) return null;

  return (
    <section className="ns-container mt-14 md:mt-20">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="ns-section-title !mb-1">امروز کجا بریم؟</h2>
          <p className="text-sm text-text-muted">
            مقاصد و جاذبه‌هایی که همین حالا ترند هستند
          </p>
        </div>
        <Link
          href="/destinations"
          className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-white text-xs font-bold text-text-muted hover:border-primary hover:text-primary-dark transition"
        >
          مشاهده همه
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <StoriesCarousel items={items} />
    </section>
  );
}
