import HomeHero from "@/components/home/HomeHero";
import StatsBar from "@/components/home/StatsBar";
import DestinationStories from "@/components/home/DestinationStories";
import TrendingNow from "@/components/home/TrendingNow";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import CollectionsSection from "@/components/home/CollectionsSection";
import VisaSection from "@/components/home/VisaSection";
import MagazineSection from "@/components/home/MagazineSection";

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

      {/* سکشن ۵: هتل‌های برگزیده */}
      <FeaturedHotels />

      <CollectionsSection />

      <VisaSection />
      
      <MagazineSection />

    </>
  );
}