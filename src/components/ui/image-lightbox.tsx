"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageLightboxProps {
  images: { url: string; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    onIndexChange?.(next);
  }, [currentIndex, images.length, onIndexChange]);

  const goPrev = useCallback(() => {
    const next = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(next);
    onIndexChange?.(next);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const current = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Produktbild in voller Größe"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-[#173A57]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Galerie schließen"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="relative z-10 flex w-full max-w-4xl items-center justify-center px-16">
        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Vorheriges Bild"
            className="absolute left-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FDF277] text-[#173A57] shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <div className="flex max-h-[85vh] w-full items-center justify-center">
          <img alt={current.alt}
            src={current.url}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Nächstes Bild"
            className="absolute right-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FDF277] text-[#173A57] shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[13px] font-medium text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
