"use client";

import { FadeLeft, FadeRight, PopIn, TextReveal } from "./animations";

// Icon components matching the live site
function WaterDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="66" height="66" rx="33" fill="#173A57"></rect>
      <path d="M33 16.4307C33 16.4307 21.75 28.7979 21.75 37.5479C21.75 44.451 26.0969 48.7979 33 48.7979C39.9031 48.7979 44.25 44.451 44.25 37.5479C44.25 28.7979 33 16.4307 33 16.4307ZM34.25 44.7354V42.8604C35.4928 42.8589 36.6842 42.3646 37.563 41.4858C38.4417 40.6071 38.9361 39.4156 38.9375 38.1729H40.8125C40.8106 39.9128 40.1186 41.5809 38.8883 42.8112C37.658 44.0415 35.9899 44.7335 34.25 44.7354Z" fill="white"></path>
    </svg>
  );
}

function H2MoleculeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="66" height="66" rx="33" fill="#173A57"></rect>
      <g clipPath="url(#clip0_404_997)">
        <path d="M38.7367 14.1968C37.5968 14.1972 36.5038 14.6502 35.6978 15.4562C34.8918 16.2622 34.4388 17.3553 34.4383 18.4951C34.4391 19.2744 34.6517 20.0388 35.0533 20.7067C35.4548 21.3745 36.0304 21.9207 36.7183 22.2868L34.3483 26.7834C33.7687 26.5947 33.163 26.4979 32.5533 26.4968C31.004 26.4968 29.5182 27.1122 28.4227 28.2078C27.3271 29.3033 26.7117 30.7891 26.7117 32.3384C26.7143 32.7562 26.7618 33.1725 26.8533 33.5801L22.1367 35.3068C21.6914 34.598 21.0736 34.0137 20.3411 33.6086C19.6086 33.2034 18.7854 32.9906 17.9483 32.9901C16.6364 32.9906 15.3783 33.5118 14.4504 34.4393C13.5226 35.3669 13.0009 36.6248 13 37.9368C13 39.2496 13.5215 40.5086 14.4498 41.437C15.3781 42.3653 16.6372 42.8868 17.95 42.8868C19.2625 42.8863 20.5212 42.3646 21.4491 41.4364C22.377 40.5081 22.8983 39.2493 22.8983 37.9368C22.896 37.5813 22.8558 37.2271 22.7783 36.8801L27.305 34.8918C27.7832 35.8773 28.5293 36.7082 29.4577 37.2895C30.3862 37.8707 31.4596 38.1788 32.555 38.1784C33.8383 38.1775 35.0855 37.7534 36.1033 36.9718L39.8967 40.5834C39.0831 41.7748 38.648 43.1841 38.6483 44.6268C38.6483 45.5692 38.834 46.5023 39.1947 47.3729C39.5553 48.2435 40.084 49.0346 40.7504 49.7009C41.4169 50.3671 42.208 50.8956 43.0787 51.2561C43.9494 51.6166 44.8826 51.802 45.825 51.8018C47.7276 51.8018 49.5524 51.0461 50.8979 49.7009C52.2434 48.3556 52.9996 46.5311 53 44.6284C53 42.7255 52.2441 40.9005 50.8985 39.555C49.5529 38.2094 47.7279 37.4534 45.825 37.4534C44.1741 37.4539 42.5739 38.0244 41.295 39.0684L37.255 35.7951C37.9939 34.794 38.3934 33.5828 38.395 32.3384C38.3959 31.39 38.1655 30.4556 37.7237 29.6163C37.282 28.777 36.6423 28.0581 35.86 27.5218L37.8667 22.7034C38.1529 22.7627 38.4444 22.7929 38.7367 22.7934C39.8771 22.7934 40.9708 22.3404 41.7772 21.534C42.5836 20.7276 43.0367 19.6339 43.0367 18.4934C43.0358 17.3536 42.5824 16.2607 41.776 15.455C40.9697 14.6494 39.8765 14.1968 38.7367 14.1968Z" fill="white"></path>
      </g>
      <defs>
        <clipPath id="clip0_404_997">
          <rect width="40" height="40" fill="white" transform="translate(13 13)"></rect>
        </clipPath>
      </defs>
    </svg>
  );
}

function LemonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="66" height="66" rx="33" fill="#173A57"></rect>
      <path d="M46.3507 19.6491C45.0276 18.326 43.2346 17.9938 42.0486 18.6846C38.6738 20.6504 31.6645 15.6438 23.6539 23.6544C15.6432 31.6651 20.6499 38.6743 18.6842 42.049C17.9933 43.235 18.3255 45.028 19.6485 46.3511C20.9717 47.6743 22.7647 48.0063 23.9508 47.3155C27.3254 45.3498 34.3347 50.3564 42.3452 42.3458C50.3558 34.3352 45.3493 27.3259 47.315 23.9513C48.0059 22.7652 47.6737 20.9722 46.3507 19.6491ZM32.3053 23.8061C28.9716 24.6395 24.6392 28.9712 23.8057 32.3057C23.7016 32.7222 23.3277 33.0003 22.917 33.0003C22.8435 33.0003 22.7686 32.9914 22.694 32.9727C22.2029 32.8499 21.9043 32.3523 22.027 31.8611C23.0252 27.8683 27.8615 23.0274 31.8606 22.0275C32.3519 21.9047 32.8495 22.2034 32.9722 22.6945C33.0949 23.1857 32.7964 23.6833 32.3053 23.8061Z" fill="white"></path>
    </svg>
  );
}

const ingredients = [
  {
    Icon: WaterDropIcon,
    title: "Stilles Wasser",
    desc: "Stilles, hochreines Wasser dient als Träger, um molekularen Wasserstoff direkt in deine Zellen zu bringen.",
  },
  {
    Icon: H2MoleculeIcon,
    title: "Molekularer Wasserstoff",
    desc: "Durch innovative Nanobubble-Technologie wird molekularer Wasserstoff in extrem stabilen, winzigen Bläschen gelöst.",
  },
  {
    Icon: LemonIcon,
    title: "Zitronen-Limetten-Aroma",
    desc: "Ein leichter, natürlicher Hauch von Zitrone-Limette sorgt für ein erfrischendes Trinkerlebnis.",
  },
];

export function WhatsInsideSection() {
  return (
    <section className="bg-[#F5F5F5] py-10 sm:py-16 px-4 lg:px-8">
      <div className="mx-auto max-w-[1350px] border-t border-[#C3C9CD] pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <FadeLeft className="lg:col-span-3">
            <TextReveal>
              <h2 className="font-gothic text-[24px] font-bold text-[#173A57] mb-3 sm:text-[30px]">
                WAS IST DRIN?
              </h2>
            </TextReveal>
            <p className="text-[14px] text-[#173A57] mb-1">
              Eine einfache Formel, entwickelt rund um molekularen Wasserstoff.
            </p>
            <p className="text-[14px] text-[#173A57]">
              Nichts Überflüssiges. Nur das, was zählt.
            </p>
          </FadeLeft>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
              {ingredients.map((item, idx) => {
                const IconComponent = item.Icon;
                return (
                  <FadeRight key={item.title} delay={idx * 100} className="flex flex-col border-l border-[#C3C9CD] pl-4 sm:pl-6">
                    <div className="flex items-center gap-4 mb-4">
                      <PopIn delay={idx * 150} className="shrink-0">
                        <IconComponent className="w-12 h-12" />
                      </PopIn>
                      <h3 className="font-gothic font-bold text-[20px] text-[#173A57]">{item.title}</h3>
                    </div>
                    <p className="text-[14px] text-[#173A57] leading-relaxed">
                      {item.desc}
                    </p>
                  </FadeRight>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
