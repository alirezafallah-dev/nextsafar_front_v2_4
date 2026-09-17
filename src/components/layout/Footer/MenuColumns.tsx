import Link from "next/link";

interface MenuSection {
  title: string;
  links: { label: string; href: string }[];
}

const menuSections: MenuSection[] = [
  {
    title: "دسترسی سریع",
    links: [
      { label: "تورها", href: "/tours" },
      { label: "هتل‌ها", href: "/hotels" },
      { label: "پروازها", href: "/flights" },
      { label: "ویزا", href: "/visa" },
      { label: "اخبار و مقالات", href: "/news" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "تماس با ما", href: "/contact" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "بازگشت وجه", href: "/refund-policy" },
      { label: "حریم خصوصی", href: "/privacy-policy" },
      { label: "شرایط استفاده", href: "/terms" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "راهنمای رزرو", href: "/how-to-book" },
      { label: "پشتیبانی", href: "/support" },
      { label: "فرصت‌های شغلی", href: "/careers" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
];

export default function MenuColumns() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {menuSections.map((section, idx) => (
        <div key={idx}>
          <h3 className="sfp3-head text-base mb-3">{section.title}</h3>
          <ul className="space-y-2.5">
            {section.links.map((link, linkIdx) => (
              <li key={linkIdx}>
                <Link
                  href={link.href}
                  className="text-sm text-text hover:text-primary-600 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
