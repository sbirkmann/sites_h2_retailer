"use client";

import { useState } from "react";
import type { Review } from "./reviews-data";

function TrustpilotStars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-[22px] h-[22px] bg-trustpilot flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 text-white"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate =
    review.truncateAt !== undefined && review.text.length > review.truncateAt;
  const displayText =
    shouldTruncate && !expanded
      ? review.text.slice(0, review.truncateAt) + "..."
      : review.text;

  return (
    <div className="break-inside-avoid mb-5 bg-white rounded-lg border border-black/[0.06] p-6 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <TrustpilotStars />

      <span className="self-start inline-block border border-review-tag/40 text-review-tag tracking-[0.1em] uppercase px-2 py-0.5 rounded-md text-[10px] leading-none font-bold">
        {review.tag}
      </span>

      <p className="font-gothic text-navy/80 text-base rounded-none leading-relaxed font-normal">
        &ldquo;{displayText}&rdquo;
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start font-gothic text-[14px] font-bold text-review-tag hover:text-review-tag/70 transition-colors cursor-pointer"
        >
          {expanded ? "Weniger anzeigen" : "Mehr lesen"}
        </button>
      )}

      <div className="flex items-center gap-3 mt-1">
        <div className="w-9 h-9 rounded-full bg-trustpilot/90 flex items-center justify-center text-white font-gothic font-bold text-[12px] shrink-0">
          {review.initials}
        </div>
        <div>
          <p className="font-gothic text-[14px] text-navy leading-tight">
            {review.name}
          </p>
        </div>
      </div>
    </div>
  );
}
