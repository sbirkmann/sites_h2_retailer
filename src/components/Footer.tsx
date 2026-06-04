"use client";

import React from "react";
import { Shield, Truck, Award } from "lucide-react";
import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

const socialLinks = [
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/wasserstofftrinken",
    label: "Instagram",
  },
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/people/AWAKE-I-Wasserstofftrinken/61587352075219/",
    label: "Facebook",
  },
];

const trustBadges = [
  { icon: Award, label: "Made in Germany" },
  { icon: Shield, label: "Sichere B2B Zahlung" },
  { icon: Truck, label: "Schneller Händlerversand" },
];

export default function Footer() {
  return (
    <footer className="bg-[#173A57] text-white mt-auto w-full">
      {/* Top Gradient Border */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FDF277]/30 to-transparent" />
      </div>

      {/* Trust Badges */}
      <div className="max-w-[1498px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-8 border-b border-white/10">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5">
              <badge.icon className="w-5 h-5 text-[#FDF277]" strokeWidth={1.5} />
              <span className="font-gothic text-[13px] sm:text-[14px] text-white/80 font-bold tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Links & Main Brand */}
        <div className="py-10 sm:py-12 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] gap-10 lg:gap-8">
            {/* Column 1: Brand Info */}
            <div>
              <Link href="/" className="inline-block cursor-pointer">
                <span className="font-rust font-bold uppercase tracking-wider text-[36px] sm:text-[42px] text-white">
                  AWAKE
                </span>
              </Link>
              <p className="font-gothic text-[14px] sm:text-[15px] text-white/70 mt-1 mb-6 max-w-[320px] leading-relaxed">
                Der exklusive B2B Hub für das erste Wasserstoffgetränk Deutschlands. Hochdosiert, stabil, profitabel für dein Sortiment.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/70 transition-all hover:bg-[#FDF277]/20 hover:text-[#FDF277] cursor-pointer"
                  >
                    <social.icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Portal Pages */}
            <div>
              <div className="font-gothic text-[15px] sm:text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                B2B Portal
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#dashboard"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#produkte"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    B2B Sortiment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#marketing"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Marketing Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Science & Info */}
            <div>
              <div className="font-gothic text-[15px] sm:text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Informationen
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#partnerprogramm"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Partnerprogramm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#support"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Legal */}
            <div>
              <div className="font-gothic text-[15px] sm:text-[16px] font-bold text-white mb-5 uppercase tracking-wider">
                Support & Rechtliches
              </div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@h2-awake.de"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer block"
                  >
                    support@h2-awake.de
                  </a>
                </li>
                <li>
                  <a
                    href="https://h2-awake.de/imprint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Impressum
                  </a>
                </li>
                <li>
                  <a
                    href="https://h2-awake.de/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/65 hover:text-[#FDF277] transition-colors font-gothic text-[14px] cursor-pointer"
                  >
                    Datenschutz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom / Payment & Copyright */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              {/* Mastercard */}
              <div title="Mastercard">
                <svg
                  width="48"
                  height="34"
                  viewBox="0 0 57 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-auto opacity-80 hover:opacity-100 transition-opacity"
                >
                  <rect width="57" height="40" rx="8" fill="white" />
                  <path d="M33.3442 10.5674H22.5598V29.4253H33.3442V10.5674Z" fill="#FF5F00" />
                  <path
                    d="M23.2446 19.9972C23.2446 16.3323 24.9906 12.8339 27.9349 10.5683C22.5941 6.47015 14.8225 7.36973 10.6114 12.6006C6.43462 17.7982 7.359 25.3281 12.7341 29.4262C17.219 32.8579 23.4842 32.8579 27.9691 29.4262C24.9906 27.1606 23.2446 23.6622 23.2446 19.9972Z"
                    fill="#EB001B"
                  />
                  <path
                    d="M47.8947 19.9972C47.8947 26.6275 42.3826 31.9917 35.5697 31.9917C32.7965 31.9917 30.1261 31.0921 27.9692 29.4262C33.3101 25.3281 34.2344 17.7982 30.0234 12.5673C29.4072 11.8343 28.7224 11.1347 27.9692 10.5683C33.3101 6.47015 41.0817 7.36973 45.2585 12.6006C46.9703 14.6997 47.8947 17.2985 47.8947 19.9972Z"
                    fill="#F79E1B"
                  />
                </svg>
              </div>
              {/* Visa */}
              <div title="Visa">
                <svg
                  width="48"
                  height="34"
                  viewBox="0 0 57 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-auto opacity-80 hover:opacity-100 transition-opacity"
                >
                  <rect width="57" height="40" rx="8" fill="white" />
                  <mask
                    id="mask0_visa"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="8"
                    y="12"
                    width="41"
                    height="14"
                  >
                    <path
                      d="M29.0054 17.1429C28.9822 18.9565 30.6335 19.9686 31.8775 20.5703C33.1557 21.1877 33.585 21.5836 33.5801 22.1356C33.5704 22.9807 32.5605 23.3535 31.6153 23.3681C29.9664 23.3935 29.0078 22.9262 28.2455 22.5727L27.6516 25.3317C28.4163 25.6816 29.8323 25.9867 31.3007 26C34.7473 26 37.0023 24.3112 37.0145 21.6925C37.028 18.3693 32.3837 18.1853 32.4154 16.6998C32.4264 16.2495 32.8593 15.7689 33.8082 15.6466C34.2777 15.5848 35.5742 15.5376 37.0438 16.2095L37.6207 13.5401C36.8304 13.2544 35.8144 12.9807 34.5497 12.9807C31.3055 12.9807 29.0237 14.6926 29.0054 17.1429ZM43.1638 13.2108C42.5345 13.2108 42.004 13.5752 41.7674 14.1345L36.8438 25.8039H40.288L40.9734 23.9237H45.1823L45.5799 25.8039H48.6155L45.9665 13.2108H43.1638ZM43.6456 16.6127L44.6395 21.3414H41.9174L43.6456 16.6127ZM24.8294 13.2108L22.1146 25.8039H25.3965L28.1102 13.2108H24.8294ZM19.9741 13.2108L16.558 21.7821L15.1762 14.494C15.014 13.6805 14.3737 13.2108 13.6627 13.2108H8.07806L8 13.5764C9.14643 13.8234 10.449 14.2217 11.2381 14.6478C11.721 14.9081 11.8588 15.1357 12.0174 15.7543L14.6347 25.8039H18.1033L23.4208 13.2108H19.9741Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_visa)">
                    <path
                      d="M3.74683 14.5359L43.7651 -0.093544L52.8691 24.4458L12.8512 39.0752"
                      fill="url(#paint0_linear_visa)"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_visa"
                      x1="11.6791"
                      y1="25.6045"
                      x2="45.8486"
                      y2="12.9272"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#222357" />
                      <stop offset="1" stopColor="#254AA5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* PayPal */}
              <div title="PayPal">
                <svg
                  width="48"
                  height="34"
                  viewBox="0 0 57 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-auto opacity-80 hover:opacity-100 transition-opacity"
                >
                  <rect width="57" height="40" rx="8" fill="white" />
                  <path
                    d="M26.9668 23.8324L27.1027 22.969L26.7999 22.962H25.3541L26.3589 16.5911C26.3619 16.5717 26.3718 16.5539 26.3867 16.5411C26.4017 16.5284 26.4208 16.5214 26.4405 16.5215H28.8783C29.6876 16.5215 30.2461 16.6899 30.5378 17.0223C30.6745 17.1782 30.7615 17.3412 30.8036 17.5205C30.8478 17.7087 30.8486 17.9335 30.8054 18.2077L30.8023 18.2277V18.4034L30.939 18.4808C31.0434 18.5337 31.1372 18.6052 31.2158 18.6919C31.3328 18.8252 31.4084 18.9947 31.4404 19.1956C31.4734 19.4022 31.4625 19.648 31.4084 19.9264C31.346 20.2466 31.2452 20.5254 31.109 20.7536C30.9888 20.9581 30.8273 21.1351 30.6347 21.2734C30.4538 21.4018 30.2389 21.4993 29.9959 21.5616C29.7604 21.623 29.4919 21.6539 29.1975 21.6539H29.0077C28.8721 21.6539 28.7403 21.7028 28.6369 21.7904C28.5336 21.8789 28.4651 22.0012 28.4435 22.1355L28.4292 22.2132L28.1891 23.7349L28.1782 23.7908C28.1753 23.8084 28.1704 23.8173 28.1631 23.8233C28.156 23.829 28.1472 23.8322 28.1381 23.8324H26.9668Z"
                    fill="#253B80"
                  />
                  <path
                    d="M35.9569 14.6865C35.9362 14.8191 35.9126 14.9546 35.886 15.0937C34.9727 19.7961 31.8483 21.4206 27.858 21.4206H25.8262C25.3382 21.4206 24.927 21.776 24.851 22.2587L23.8107 28.875L23.5161 30.7505C23.5044 30.8249 23.5089 30.9009 23.5293 30.9734C23.5497 31.0459 23.5855 31.1131 23.6342 31.1704C23.683 31.2277 23.7436 31.2737 23.8118 31.3052C23.88 31.3368 23.9542 31.3532 24.0293 31.3532H27.6328C28.0595 31.3532 28.422 31.0422 28.4892 30.6202L28.5246 30.4366L29.2031 26.1185L29.2467 25.8815C29.3131 25.458 29.6763 25.1471 30.1031 25.1471H30.642C34.1333 25.1471 36.8664 23.7255 37.6652 19.6117C37.9989 17.8932 37.8262 16.4583 36.9432 15.4491C36.6633 15.137 36.3291 14.8785 35.9569 14.6865Z"
                    fill="#179BD7"
                  />
                  <path
                    d="M35.0974 14.2372C34.8039 14.1511 34.5054 14.0839 34.2036 14.036C33.6072 13.943 33.0045 13.8984 32.4012 13.9026H26.9389C26.731 13.9024 26.5299 13.9777 26.372 14.1148C26.214 14.252 26.1097 14.4419 26.0778 14.6502L24.9158 22.1159L24.8823 22.3337C24.9185 22.0961 25.0374 21.8794 25.2174 21.7229C25.3974 21.5664 25.6267 21.4805 25.8638 21.4806H27.9084C31.9242 21.4806 35.0684 19.8263 35.9875 15.0406C36.015 14.8989 36.038 14.761 36.0588 14.6261C35.8163 14.4971 35.5635 14.389 35.3032 14.3028C35.2349 14.2798 35.1663 14.258 35.0974 14.2372Z"
                    fill="#222D65"
                  />
                  <path
                    d="M26.0739 14.6828C26.1053 14.4787 26.2086 14.2926 26.3651 14.1584C26.5216 14.0242 26.7208 13.9507 26.9267 13.9513H32.3363C32.9772 13.9513 33.5754 13.9934 34.1214 14.082C34.4909 14.1402 34.8552 14.2274 35.2111 14.3426C35.4797 14.4319 35.7291 14.5374 35.9594 14.6592C36.2302 12.9268 35.9572 11.7473 35.0235 10.6792C33.9941 9.5034 32.1362 9 29.7588 9H22.857C22.3714 9 21.9571 9.3543 21.8821 9.8363L19.0073 28.116C18.9939 28.2009 18.999 28.2876 19.0222 28.3703C19.0455 28.453 19.0863 28.5297 19.1419 28.5951C19.1974 28.6605 19.2665 28.713 19.3442 28.749C19.422 28.7851 19.5066 28.8038 19.5923 28.8039H23.8533L24.9231 21.9947L26.0739 14.6828Z"
                    fill="#253B80"
                  />
                </svg>
              </div>
            </div>

            {/* Copyright and Links */}
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
              <p className="text-white/50 font-gothic text-[13px]">
                © {new Date().getFullYear()} H2 Vital GmbH. AWAKE Retailer Portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
