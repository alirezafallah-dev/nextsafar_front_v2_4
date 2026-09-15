import HomeHero from "@/components/home/HomeHero";
import StatsBar from "@/components/home/StatsBar";
import DestinationStories from "@/components/home/DestinationStories";
import TrendingNow from "@/components/home/TrendingNow";
import WorldMapSection from "@/components/home/WorldMapSection";
import FeaturedHotels from "@/components/home/FeaturedHotels";

export default function HomePage() {
  return (
    <>
      {/* سکشن ۱: هیرو + جستجو */}
      <HomeHero />

      {/* سکشن ۲: نوار آمار زنده */}
      <StatsBar />

      {/* سکشن ۳: استوری مقاصد */}
      <DestinationStories />

      {/* سکشن ۴: داغ‌ترین‌ها */}
      <TrendingNow />

      {/* سکشن ۵: مقاصد محبوب + نقشه */}
      <WorldMapSection />

      {/* سکشن ۶: هتل‌های برگزیده */}
      <FeaturedHotels />

      {/* TODO: سکشن ۷ - بنر AI Trip Planner */}
      {/* TODO: سکشن ۸ - خدمات ویزا */}
      {/* TODO: سکشن ۹ - سفر بر اساس علاقه */}
      {/* TODO: سکشن ۱۰ - شکم‌گردی */}
      {/* TODO: سکشن ۱۱ - گردشگری درمانی */}
      {/* TODO: سکشن ۱۲ - مجله + اخبار */}
    </>
  );
}