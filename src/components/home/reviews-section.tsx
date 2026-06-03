"use client";

import { useEffect, useState } from "react";
import { SectionBadge } from "@/components/shared/section-badge";
import { X } from "lucide-react";
import { reviews } from "@/components/reviews/reviews-data";
import { ReviewCard } from "@/components/reviews/reviews-content";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const AUTO_SWIPE_INTERVAL_MS = 4000;
const DESKTOP_INITIAL_COUNT = 8;

const MOBILE_MIN_WORDS = 20;
const MOBILE_MAX_WORDS = 30;

const mobileReviews = reviews.filter((review) => {
  const wordCount = review.text.trim().split(/\s+/).length;
  return wordCount >= MOBILE_MIN_WORDS && wordCount <= MOBILE_MAX_WORDS;
});

function ReviewsMobileCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = window.setInterval(() => {
      if (!api.canScrollNext()) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }, AUTO_SWIPE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [api]);

  return (
    <div className="sm:hidden">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: false, watchDrag: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {mobileReviews.map((review) => (
            <CarouselItem key={review.name} className="pl-4 basis-[88%]">
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export function ReviewsSection() {
  const [showAllDesktop, setShowAllDesktop] = useState(false);

  const visibleDesktopReviews = showAllDesktop
    ? reviews
    : reviews.slice(0, DESKTOP_INITIAL_COUNT);

  const hasMoreDesktop = reviews.length > DESKTOP_INITIAL_COUNT;

  return (
    <section
      id="erfahrungsberichte"
      className="py-14 sm:py-18 lg:py-22 text-base font-normal leading-none bg-white rounded-none"
    >
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8 mb-10 sm:mb-14">
        <div className="text-center">
          <SectionBadge variant="navy" className="mb-4 sm:mb-6">
            ERFAHRUNGSBERICHTE
          </SectionBadge>
          <h2 className="font-gothic text-[24px] font-bold text-navy mb-4 sm:text-[30px] lg:text-[36px] uppercase">
            Das sagen unsere Kunden
          </h2>
          <p className="font-gothic text-navy/60 max-w-lg font-normal text-[14px] rounded-none mx-auto">
            Über 3.000+ zufriedene Kunden vertrauen bereits auf die Kraft von
            AWAKE.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <ReviewsMobileCarousel />

        <div className="hidden sm:block">
          <div className="columns-2 lg:columns-4 gap-5">
            {visibleDesktopReviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {hasMoreDesktop && (
              showAllDesktop ? (
                <button
                  type="button"
                  onClick={() => setShowAllDesktop(false)}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 bg-awake-blue text-white font-bold text-[14px] px-8 py-3 rounded-full transition-opacity hover:opacity-90"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Weniger anzeigen
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAllDesktop(true)}
                  className="cursor-pointer inline-flex items-center justify-center bg-awake-blue text-white font-bold text-[14px] px-8 py-3 rounded-full transition-opacity hover:opacity-90"
                >
                  Mehr anzeigen
                </button>
              )
            )}
            {showAllDesktop && (
              <a
                href="/erfahrungsberichte"
                className="cursor-pointer inline-flex items-center justify-center border-2 border-awake-blue text-awake-blue font-bold text-[14px] px-8 py-3 rounded-full transition-colors hover:bg-awake-blue hover:text-white"
              >
                Alle Erfahrungen lesen
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
