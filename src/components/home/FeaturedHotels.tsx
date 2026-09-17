import FeaturedHotelsClient, { FeaturedHotel } from "./FeaturedHotelsClient";

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || "http://nextsafar.local/wp-json";

export default async function FeaturedHotels() {
  let hotels: FeaturedHotel[] = [];

  try {
    const res = await fetch(`${WP_API_URL}/nextsafar/v1/featured-hotels`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      hotels = await res.json();
    }
  } catch {
    hotels = [];
  }

  if (hotels.length === 0) return null;

  return <FeaturedHotelsClient hotels={hotels} />;
}
