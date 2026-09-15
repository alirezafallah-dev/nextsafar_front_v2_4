const badges = [
  {
    name: "سازمان هواپیمایی کشور",
    url: "https://caa.gov.ir/",
    img: "/images/trust/sazman-hp-img.webp",
  },
  {
    name: "سازمان میراث فرهنگی",
    url: "https://tehran.mcth.ir/",
    img: "/images/trust/Iran-Cultural-Heritage-img.webp",
  },
  {
    name: "انجمن شرکت‌های هواپیمایی",
    url: "http://aira.ir/",
    img: "/images/trust/anjoman-img.webp",
  },
  {
    name: "سامانه حقوق مسافر",
    url: "https://farasa.cao.ir/",
    img: "/images/trust/hoghoogh-img.webp",
  },
  {
    name: "IATA",
    url: "https://www.iata.org/",
    img: "/images/trust/iata-img.webp",
  },
  {
    name: "اینماد",
    url: "https://trustseal.enamad.ir/?id=578840&Code=ppO46zrW01rOZ6fqsA5B6KjMMKWGr6nK",
    img: "https://trustseal.enamad.ir/logo.aspx?id=578840&Code=ppO46zrW01rOZ6fqsA5B6KjMMKWGr6nK",
    remote: true,
  },
];

export default function TrustBox() {
  return (
    <div>
      <h3 className="sfp3-head text-base mb-3">مجوز ها</h3>

      <div className="border border-border rounded-xl p-2 bg-white shadow-card inline-block">
        <ul className="grid grid-cols-2 gap-2" role="list">
          {badges.map((badge) => (
            <li key={badge.name} className="flex items-center justify-center">
              <a
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                aria-label={badge.name}
                title={badge.name}
                className="block w-full max-w-[70px] h-[70px]"
              >
                <img
                  src={badge.img}
                  alt={badge.name}
                  width={140}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy={badge.remote ? "origin" : "no-referrer"}
                  className="w-full h-full object-contain bg-white border border-border rounded-lg p-1 transition hover:opacity-85"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
