import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMenus } from "@/lib/api/menu";

export const metadata: Metadata = {
  title: {
    default: "نکست سفر | رزرو هتل، تور، ویزا و بلیط",
    template: "%s | سفر بعدی ایرانیان",
  },
  description: "بهترین قیمت هتل، تور، ویزا و بلیط پرواز در نکست سفر.",
  keywords: ["هتل", "تور", "ویزا", "بلیط پرواز", "سفر", "گردشگری"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // خواندن منوها از WordPress
  const [mainMenuItems, secMenuItems] = await Promise.all([
    getMenus("mainmenu"),
    getMenus("secmenu"),
  ]);

  return (
    <html lang="fa" dir="rtl">
      <link rel="preconnect" href="https://tile.jawg.io" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://tile.jawg.io" />
      <link rel="preconnect" href="https://a.tile.openstreetmap.org" crossOrigin="anonymous" />
      <body className="antialiased bg-white text-text min-h-screen flex flex-col">
        <Header mainMenuItems={mainMenuItems} secMenuItems={secMenuItems} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
