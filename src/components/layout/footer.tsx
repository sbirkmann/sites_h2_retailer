'use client'

import React from 'react'
import { Shield, Truck, Award } from 'lucide-react'
import { useCookieConsent } from '@/lib/cookie-consent'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  )
}

const socialLinks = [
  { icon: InstagramIcon, href: "https://www.instagram.com/wasserstofftrinken", label: "Instagram" },
  { icon: FacebookIcon, href: "https://www.facebook.com/people/AWAKE-I-Wasserstofftrinken/61587352075219/", label: "Facebook" },
]

const trustBadges = [
  { icon: Award, label: "Made in Germany" },
  { icon: Shield, label: "Sichere Zahlung" },
  { icon: Truck, label: "Schnelle Lieferung" },
]

function CookieSettingsLink() {
  const { openSettings } = useCookieConsent()
  return (
    <button
      onClick={openSettings}
      className="font-gothic text-[13px] text-white/50 hover:text-white/70 transition-colors cursor-pointer"
    >
      Cookie-Einstellungen
    </button>
  )
}

export function Footer() {
  return (
    <footer className="bg-awake-blue text-white mt-auto">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cta-yellow/30 to-transparent" />
      </div>

      <div className="max-w-[1498px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-8 border-b border-white/10">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5">
              <badge.icon className="w-5 h-5 text-cta-yellow" strokeWidth={1.5} />
              <span className="font-gothic text-[13px] sm:text-[14px] text-white/80 font-bold tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        <div className="py-10 sm:py-12 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-8">
            <div>
              <a href="/" className="inline-block cursor-pointer">
                <span className="font-rust font-bold uppercase tracking-wider text-[42px] text-white">
                  AWAKE
                </span>
              </a>
              <p className="font-gothic text-[15px] text-white/70 mt-1 mb-6 max-w-[280px] leading-relaxed">
                Das erste Wasserstoffgetränk Deutschlands. Natürlich. Innovativ. Belebend.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/70 transition-all hover:bg-cta-yellow/20 hover:text-cta-yellow cursor-pointer"
                  >
                    <social.icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="font-gothic text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Shop
              </div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/awake-dose"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Dose (mit Geschmack)
                  </a>
                </li>
                <li>
                  <a
                    href="/glasflasche"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Flasche (ohne Geschmack)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-gothic text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Info
              </div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/faq"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Über uns
                  </a>
                </li>
                <li>
                  <a
                    href="/#erfahrungsberichte"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Erfahrungsberichte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-gothic text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Kontakt
              </div>
              <ul className="space-y-3 text-white/65 font-gothic text-[14px]">
                <li>
                  <a
                    href="mailto:support@h2-awake.de"
                    className="hover:text-cta-yellow transition-colors cursor-pointer"
                  >
                    support@h2-awake.de
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-gothic text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Rechtliches
              </div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/shipping"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Versand
                  </a>
                </li>
                <li>
                  <a
                    href="/returns"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Widerruf
                  </a>
                </li>
                <li>
                  <a
                    href="/imprint"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Impressum
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-white/65 hover:text-cta-yellow transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Datenschutz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <div title="Mastercard">
                <svg width="57" height="40" viewBox="0 0 57 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="57" height="40" rx="8" fill="white"/>
                  <path d="M33.3442 10.5674H22.5598V29.4253H33.3442V10.5674Z" fill="#FF5F00"/>
                  <path d="M23.2446 19.9972C23.2446 16.3323 24.9906 12.8339 27.9349 10.5683C22.5941 6.47015 14.8225 7.36973 10.6114 12.6006C6.43462 17.7982 7.359 25.3281 12.7341 29.4262C17.219 32.8579 23.4842 32.8579 27.9691 29.4262C24.9906 27.1606 23.2446 23.6622 23.2446 19.9972Z" fill="#EB001B"/>
                  <path d="M47.8947 19.9972C47.8947 26.6275 42.3826 31.9917 35.5697 31.9917C32.7965 31.9917 30.1261 31.0921 27.9692 29.4262C33.3101 25.3281 34.2344 17.7982 30.0234 12.5673C29.4072 11.8343 28.7224 11.1347 27.9692 10.5683C33.3101 6.47015 41.0817 7.36973 45.2585 12.6006C46.9703 14.6997 47.8947 17.2985 47.8947 19.9972Z" fill="#F79E1B"/>
                </svg>
              </div>
              <div title="Visa">
                <svg width="57" height="40" viewBox="0 0 57 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="57" height="40" rx="8" fill="white"/>
                  <mask id="mask0_523_2432" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="8" y="12" width="41" height="14">
                    <path d="M29.0054 17.1429C28.9822 18.9565 30.6335 19.9686 31.8775 20.5703C33.1557 21.1877 33.585 21.5836 33.5801 22.1356C33.5704 22.9807 32.5605 23.3535 31.6153 23.3681C29.9664 23.3935 29.0078 22.9262 28.2455 22.5727L27.6516 25.3317C28.4163 25.6816 29.8323 25.9867 31.3007 26C34.7473 26 37.0023 24.3112 37.0145 21.6925C37.028 18.3693 32.3837 18.1853 32.4154 16.6998C32.4264 16.2495 32.8593 15.7689 33.8082 15.6466C34.2777 15.5848 35.5742 15.5376 37.0438 16.2095L37.6207 13.5401C36.8304 13.2544 35.8144 12.9807 34.5497 12.9807C31.3055 12.9807 29.0237 14.6926 29.0054 17.1429ZM43.1638 13.2108C42.5345 13.2108 42.004 13.5752 41.7674 14.1345L36.8438 25.8039H40.288L40.9734 23.9237H45.1823L45.5799 25.8039H48.6155L45.9665 13.2108H43.1638ZM43.6456 16.6127L44.6395 21.3414H41.9174L43.6456 16.6127ZM24.8294 13.2108L22.1146 25.8039H25.3965L28.1102 13.2108H24.8294ZM19.9741 13.2108L16.558 21.7821L15.1762 14.494C15.014 13.6805 14.3737 13.2108 13.6627 13.2108H8.07806L8 13.5764C9.14643 13.8234 10.449 14.2217 11.2381 14.6478C11.721 14.9081 11.8588 15.1357 12.0174 15.7543L14.6347 25.8039H18.1033L23.4208 13.2108H19.9741Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_523_2432)">
                    <path d="M3.74683 14.5359L43.7651 -0.093544L52.8691 24.4458L12.8512 39.0752" fill="url(#paint0_linear_523_2432)"/>
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_523_2432" x1="11.6791" y1="25.6045" x2="45.8486" y2="12.9272" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#222357"/>
                      <stop offset="1" stopColor="#254AA5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div title="SEPA">
                <svg width="57" height="40" viewBox="0 0 57 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="57" height="40" rx="8" fill="white"/>
                  <path d="M16.5573 17.8256H13.618C13.6227 17.7743 13.6254 17.7148 13.6254 17.6547C13.6254 17.3576 13.5596 17.0763 13.442 16.825L13.4469 16.8366C13.2714 16.589 12.7888 16.4652 11.9992 16.4652C11.9136 16.4578 11.814 16.4536 11.7135 16.4536C11.2679 16.4536 10.8413 16.5366 10.4478 16.6884L10.4725 16.68C10.2239 16.8232 10.0996 17.1364 10.0996 17.6197C10.0936 17.6598 10.0901 17.7061 10.0901 17.7532C10.0901 18.0453 10.2214 18.306 10.4269 18.4775L10.4286 18.4789C10.6095 18.5829 10.8247 18.6468 11.054 18.6533L11.0559 18.6534L11.6482 18.6981C12.9205 18.7846 13.7145 18.8443 14.0304 18.8771C14.866 18.8981 15.628 19.2035 16.2307 19.7014L16.2239 19.696C16.5737 20.0417 16.8071 20.5081 16.8593 21.0292L16.8601 21.0384C16.8993 21.3643 16.9216 21.7416 16.9216 22.1243C16.9216 22.1389 16.9215 22.1536 16.9215 22.1683V22.166C16.927 22.2634 16.9302 22.3775 16.9302 22.4923C16.9302 23.1348 16.8307 23.7537 16.6466 24.3338L16.6582 24.2915C16.3306 25.1119 15.5995 25.6309 14.4647 25.8487C13.8944 25.9391 13.2366 25.9908 12.567 25.9908C12.463 25.9908 12.3592 25.9896 12.2558 25.9871L12.2712 25.9874C12.0984 25.9954 11.8959 26 11.6923 26C10.6773 26 9.68838 25.8862 8.73712 25.6704L8.8273 25.6876C8.08291 25.4891 7.49865 24.9302 7.25703 24.2092L7.25232 24.1931C7.09438 23.629 7.00353 22.9811 7.00353 22.3116C7.00353 22.2368 7.00467 22.1622 7.00692 22.088L7.00666 22.0989H9.95038V22.3495C9.95038 22.8685 10.0966 23.2026 10.3891 23.3518C10.6009 23.4535 10.8492 23.5129 11.1111 23.5129C11.1164 23.5129 11.1217 23.5129 11.1269 23.5129H12.2098C12.2768 23.517 12.3551 23.5194 12.434 23.5194C12.7292 23.5194 13.0167 23.4861 13.2931 23.4229L13.2671 23.4278C13.512 23.3393 13.7032 23.1501 13.7958 22.9104L13.7979 22.9043C13.8402 22.7492 13.8646 22.571 13.8646 22.3871C13.8646 22.366 13.8643 22.3449 13.8636 22.324L13.8637 22.327C13.8637 21.799 13.675 21.4783 13.2977 21.365C12.7296 21.2724 12.0503 21.2051 11.3608 21.1781L11.3279 21.177C10.3862 21.1084 9.7325 21.0428 9.36691 20.9802C8.40466 20.7952 7.76414 20.4163 7.44535 19.8436C7.16443 19.2701 7 18.5943 7 17.8792C7 17.7926 7.00242 17.7066 7.00718 17.6213L7.00664 17.6331C7.00514 17.5835 7.00428 17.5252 7.00428 17.4667C7.00428 16.888 7.08847 16.3293 7.24512 15.8027L7.23476 15.8432C7.36718 15.4151 7.62591 15.0599 7.9658 14.8137L7.9718 14.8096C8.5084 14.44 9.1625 14.2073 9.86765 14.1745L9.87579 14.1742C10.5192 14.1175 11.2329 14.0892 12.0167 14.0892C12.139 14.0844 12.2826 14.0817 12.4269 14.0817C13.2131 14.0817 13.9809 14.1626 14.7225 14.3167L14.6489 14.3039C15.93 14.6559 16.5705 15.6389 16.5705 17.2528C16.5705 17.387 16.5705 17.5839 16.5398 17.8479L16.5573 17.8256ZM29.4948 25.9874V14.0042H35.3867C35.4556 14.0015 35.5365 14 35.6178 14C36.1918 14 36.7486 14.075 37.2794 14.2158L37.2336 14.2055C38.1587 14.4753 38.8803 15.1819 39.18 16.0866L39.1859 16.1073C39.354 16.6991 39.4507 17.3789 39.4507 18.0817C39.4507 18.1868 39.4485 18.2913 39.4443 18.3953L39.4448 18.3804C39.4504 18.4973 39.4537 18.6343 39.4537 18.772C39.4537 19.5657 39.3463 20.3338 39.1456 21.0621L39.1596 21.0026C38.8139 22.0143 37.9181 22.7412 36.8468 22.8144L36.8388 22.8148C36.7013 22.8387 36.1164 22.8596 35.084 22.8775H32.6711V25.9695L29.4948 25.9874ZM32.6579 20.1121H34.6453C34.6853 20.1138 34.7324 20.1147 34.7796 20.1147C35.1384 20.1147 35.4847 20.0598 35.8108 19.9578L35.7859 19.9644C35.9913 19.8234 36.1316 19.5976 36.1585 19.3373L36.1588 19.3335C36.1987 19.0872 36.2215 18.8034 36.2215 18.5141C36.2215 18.4734 36.221 18.4328 36.2201 18.3923L36.2202 18.3983C36.2223 18.3512 36.2234 18.296 36.2234 18.2405C36.2234 17.8958 36.1791 17.5617 36.0958 17.2438L36.1018 17.2707C35.9745 16.9203 35.6622 16.6694 35.289 16.64L35.2858 16.6397H32.658L32.6579 20.1121ZM46.1921 23.9156H41.9673L41.4013 25.9874H38.1286L41.6383 14.0042H46.4246L50 25.9874H46.7975L46.1921 23.9156ZM45.5647 21.5798L44.0863 16.3892L42.6473 21.5798H45.5647ZM25.1297 15.6911H25.1323C26.4331 15.6911 27.5944 16.3002 28.357 17.254L28.3629 17.2617L29.0429 15.7716C27.9729 14.7425 26.5266 14.11 24.9355 14.11C22.4782 14.11 20.3663 15.6186 19.4415 17.7772L19.4264 17.8166H18.1103L17.3162 19.5483H19.0272V20.0271C19.028 20.233 19.0391 20.4352 19.0601 20.6344L19.058 20.6088H18.1805L17.3952 22.3271H19.4747C20.4186 24.4691 22.4921 25.9338 24.901 25.9338C24.912 25.9338 24.923 25.9338 24.934 25.9337H24.9323L24.9538 25.9338C26.186 25.9338 27.3314 25.5544 28.2838 24.904L28.2621 24.918V22.8149C27.4958 23.705 26.3778 24.2638 25.1319 24.2638C23.6787 24.2638 22.3997 23.5037 21.656 22.352L21.6463 22.3361H26.0027L26.788 20.6178H21.0014C20.973 20.4303 20.9568 20.214 20.9568 19.9938C20.9568 19.8369 20.965 19.682 20.9811 19.5294L20.9795 19.5483H27.2705L28.0646 17.8166H21.5234C22.2559 16.5361 23.5955 15.6889 25.1293 15.6866H25.1296L25.1297 15.6911Z" fill="black"/>
                </svg>
              </div>
              <div title="PayPal">
                <svg width="57" height="40" viewBox="0 0 57 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="57" height="40" rx="8" fill="white"/>
                  <path d="M26.9668 23.8324L27.1027 22.969L26.7999 22.962H25.3541L26.3589 16.5911C26.3619 16.5717 26.3718 16.5539 26.3867 16.5411C26.4017 16.5284 26.4208 16.5214 26.4405 16.5215H28.8783C29.6876 16.5215 30.2461 16.6899 30.5378 17.0223C30.6745 17.1782 30.7615 17.3412 30.8036 17.5205C30.8478 17.7087 30.8486 17.9335 30.8054 18.2077L30.8023 18.2277V18.4034L30.939 18.4808C31.0434 18.5337 31.1372 18.6052 31.2158 18.6919C31.3328 18.8252 31.4084 18.9947 31.4404 19.1956C31.4734 19.4022 31.4625 19.648 31.4084 19.9264C31.346 20.2466 31.2452 20.5254 31.109 20.7536C30.9888 20.9581 30.8273 21.1351 30.6347 21.2734C30.4538 21.4018 30.2389 21.4993 29.9959 21.5616C29.7604 21.623 29.4919 21.6539 29.1975 21.6539H29.0077C28.8721 21.6539 28.7403 21.7028 28.6369 21.7904C28.5336 21.8789 28.4651 22.0012 28.4435 22.1355L28.4292 22.2132L28.1891 23.7349L28.1782 23.7908C28.1753 23.8084 28.1704 23.8173 28.1631 23.8233C28.156 23.829 28.1472 23.8322 28.1381 23.8324H26.9668Z" fill="#253B80"/>
                  <path d="M35.9569 14.6865C35.9362 14.8191 35.9126 14.9546 35.886 15.0937C34.9727 19.7961 31.8483 21.4206 27.858 21.4206H25.8262C25.3382 21.4206 24.927 21.776 24.851 22.2587L23.8107 28.875L23.5161 30.7505C23.5044 30.8249 23.5089 30.9009 23.5293 30.9734C23.5497 31.0459 23.5855 31.1131 23.6342 31.1704C23.683 31.2277 23.7436 31.2737 23.8118 31.3052C23.88 31.3368 23.9542 31.3532 24.0293 31.3532H27.6328C28.0595 31.3532 28.422 31.0422 28.4892 30.6202L28.5246 30.4366L29.2031 26.1185L29.2467 25.8815C29.3131 25.458 29.6763 25.1471 30.1031 25.1471H30.642C34.1333 25.1471 36.8664 23.7255 37.6652 19.6117C37.9989 17.8932 37.8262 16.4583 36.9432 15.4491C36.6633 15.137 36.3291 14.8785 35.9569 14.6865Z" fill="#179BD7"/>
                  <path d="M35.0974 14.2372C34.8039 14.1511 34.5054 14.0839 34.2036 14.036C33.6072 13.943 33.0045 13.8984 32.4012 13.9026H26.9389C26.731 13.9024 26.5299 13.9777 26.372 14.1148C26.214 14.252 26.1097 14.4419 26.0778 14.6502L24.9158 22.1159L24.8823 22.3337C24.9185 22.0961 25.0374 21.8794 25.2174 21.7229C25.3974 21.5664 25.6267 21.4805 25.8638 21.4806H27.9084C31.9242 21.4806 35.0684 19.8263 35.9875 15.0406C36.015 14.8989 36.038 14.761 36.0588 14.6261C35.8163 14.4971 35.5635 14.389 35.3032 14.3028C35.2349 14.2798 35.1663 14.258 35.0974 14.2372Z" fill="#222D65"/>
                  <path d="M26.0739 14.6828C26.1053 14.4787 26.2086 14.2926 26.3651 14.1584C26.5216 14.0242 26.7208 13.9507 26.9267 13.9513H32.3363C32.9772 13.9513 33.5754 13.9934 34.1214 14.082C34.4909 14.1402 34.8552 14.2274 35.2111 14.3426C35.4797 14.4319 35.7291 14.5374 35.9594 14.6592C36.2302 12.9268 35.9572 11.7473 35.0235 10.6792C33.9941 9.5034 32.1362 9 29.7588 9H22.857C22.3714 9 21.9571 9.3543 21.8821 9.8363L19.0073 28.116C18.9939 28.2009 18.999 28.2876 19.0222 28.3703C19.0455 28.453 19.0863 28.5297 19.1419 28.5951C19.1974 28.6605 19.2665 28.713 19.3442 28.749C19.422 28.7851 19.5066 28.8038 19.5923 28.8039H23.8533L24.9231 21.9947L26.0739 14.6828Z" fill="#253B80"/>
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
              <p className="text-white/50 font-gothic text-[13px]">
                © {new Date().getFullYear()} H2 Vital GmbH
              </p>
              <span className="hidden md:block text-white/20 text-[13px] leading-none">·</span>
              <CookieSettingsLink />
              <span className="hidden md:block text-white/20 text-[13px] leading-none">·</span>
              <a
                href="https://www.subbly.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-gothic text-[13px] text-white/50 hover:text-white/70 transition-colors cursor-pointer"
              >
                Powered by Subbly
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

