'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionBadge } from "@/components/shared/section-badge";

const doseImage =
'https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/770890c5-c9a8-439f-8e64-909c46acba2a-image.png';

const flascheImage =
'https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/9a115b98-8729-4627-b7c3-05963bb01eba-image.png';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({ isOpen, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-full left-0 z-50 pt-2 w-[min(90vw,820px)]"
        role="region"
        aria-label="Shop Produkte"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        
          <div className="bg-white border border-border shadow-[0_8px_30px_rgba(23,58,87,0.12)] rounded-lg overflow-hidden">
            <div className="px-6 lg:px-8 py-6 lg:py-8">
              <div className="grid grid-cols-2 gap-4 lg:gap-5">
                <ProductCard
                href="/awake-dose"
                image={doseImage}
                title="Dose (mit Geschmack)"
                description="Premium Wasserstoff Wasser mit erfrischendem Lemon Kick."
                bgClass="bg-[#173A57]"
                textClass="text-white"
                subtextClass="text-white/70"
                ctaClass="text-cta-yellow"
                onClick={onClose} />
              
                <ProductCard
                href="/glasflasche"
                image={flascheImage}
                title="Flasche (ohne Geschmack)"
                description="Reines Wasserstoff-Wasser. Pur und unverfälscht."
                bgClass="bg-hero-gray"
                textClass="text-hero-text"
                subtextClass="text-hero-text/60"
                ctaClass="text-hero-text"
                onClick={onClose} />
              
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <p className="text-navy/50 font-gothic text-[13px]">
                  Éntdecke jetzt Europas erstes Ready-to-Drink H2-Wasser
                </p>
                <a
                href="/vergleich/wasserstoffwasser-vergleich"
                onClick={onClose}
                className="flex items-center gap-2 text-navy font-gothic text-[13px] font-bold uppercase tracking-wide hover:text-awake-blue transition-colors group cursor-pointer">
                
                  AWAKE vs. Andere
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}

function ProductCard({
  href,
  image,
  title,
  description,
  badge,
  bgClass,
  textClass,
  subtextClass,
  ctaClass,
  onClick











}: {href: string;image: string;title: string;description: string;badge?: string;bgClass: string;textClass: string;subtextClass: string;ctaClass: string;onClick: () => void;}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative rounded-lg overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-lg ${bgClass}`}>
      
      {badge &&
      <span className="absolute top-3 left-3 z-10">
          <SectionBadge size="sm">{badge.toUpperCase()}</SectionBadge>
        </span>
      }

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
        <Image alt={title}
          src={image}
          fill
          sizes="(min-width: 1024px) 250px, 200px"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
        
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className={`font-gothic text-[15px] lg:text-[16px] font-bold leading-tight ${textClass}`}>
          {title}
        </h3>
        <p className={`font-gothic text-[12px] lg:text-[13px] leading-snug mt-1 ${subtextClass}`}>
          {description}
        </p>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={`font-gothic text-[11px] font-bold uppercase tracking-wide ${ctaClass}`}>
            Jetzt entdecken
          </span>
          <ArrowRight
            size={12}
            className={`group-hover:translate-x-0.5 transition-transform ${ctaClass}`} />
          
        </div>
      </div>
    </a>);

}