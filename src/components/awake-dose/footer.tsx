import { Play } from "lucide-react";

function InstagramSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

export function Footer() {
  const tags = [
    { label: "Versand & Rückgabe", href: "/shipping" },
    { label: "Monatsabos", href: "/awake-dose" },
    { label: "Impressum", href: "/imprint" },
    { label: "Datenschutz", href: "/privacy" },
    { label: "Widerrufsrecht", href: "/returns" },
    { label: "Über uns", href: "/about" },
    { label: "Partnerprogramm", href: "/partner" },
  ];

  const menuLinks = [
    { label: "Start", href: "/" },
    { label: "Produkt", href: "/awake-dose" },
    { label: "Kontakt", href: "/#kontakt" },
  ];

  return (
    <footer className="bg-[#173A57] text-white pt-16 pb-8 px-4 lg:px-8 border-t border-white/10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          <div className="md:col-span-5 flex flex-col">
            <h2 className="font-gothic text-4xl tracking-wider mb-2 text-white">AWAKE</h2>
            <p className="text-[#173A57] font-medium text-sm mb-6">Natürlich. Innovativ. Belebend.</p>
            
            <h3 className="font-gothic font-bold text-sm mb-3">Unsere Mission</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              AWAKE ist das innovative Wasserstoffgetränk der H2 Vital GmbH,
              das die antioxidativen Vorteile von molekularem Wasserstoff als
              ready-to-drink Produkt zugänglich macht. Mit bis zu 50% mehr
              Wasserstoff als vergleichbare Produkte bietet es bewussten
              Genießern und Fitness-Enthusiasten eine neue Dimension funktionaler Getränke.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/awake.wasserstoff"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <InstagramSvg className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@awake-wasserstoff"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col">
            <h3 className="font-gothic font-bold text-lg mb-6">Weitere Informationen zu:</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag.href}
                  href={tag.href}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full transition-colors font-medium border border-transparent cursor-pointer"
                >
                  {tag.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col">
            <h3 className="font-gothic font-bold text-lg mb-6">Menü</h3>
            <ul className="flex flex-col gap-3 mb-8">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="font-gothic font-bold text-lg mb-4">Zahlungsmethode</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center justify-center min-w-[40px]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
              </div>
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center justify-center min-w-[40px]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
              </div>
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center justify-center min-w-[40px]">
                <span className="text-[#173A57] font-bold text-[10px]">SEPA</span>
              </div>
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center justify-center min-w-[40px]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>{new Date().getFullYear()} H2 Vital GmbH - All Rights Reserved</p>
          <a href="https://www.subbly.co" className="hover:text-white transition-colors mt-4 md:mt-0 cursor-pointer" target="_blank" rel="noopener noreferrer">
            Powered by Subbly
          </a>
        </div>
      </div>
    </footer>
  );
}
