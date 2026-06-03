'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileSubItem {
  label: string;
  href?: string;
  subItems?: {label: string;href: string;}[];
}

interface NavItem {
  label: string;
  href?: string;
  subItems?: MobileSubItem[];
}

const mobileItems: NavItem[] = [
{
  label: 'Shop',
  subItems: [
  { label: 'Dose (mit Geschmack)', href: '/awake-dose' },
  { label: 'Flasche (ohne Geschmack)', href: '/glasflasche' }]

},
{
  label: 'H₂ Wissen',
  subItems: [
  { label: 'Themenwelt', href: '/h2-wissen' },
  { label: 'Wasserstoff erklärt', href: '/wasserstoff-erklaert' },
  { label: 'Studien', href: '/wasserstoffwasser-studien' },
  { label: 'Blog', href: '/blog' },
  {
    label: 'AWAKE vs. Andere',
    href: '/vergleich/wasserstoffwasser-vergleich',
    subItems: [
    { label: 'vs. Wasserstoff-Booster', href: '/vergleich/wasserstoff-booster-vs-wasserstoffwasser' },
    { label: 'vs. Wasserstoff-Tabletten', href: '/vergleich/wasserstofftabletten-vs-trinkfertiges-wasserstoffwasser' },
    { label: 'vs. Normales Wasser', href: '/vergleich/wasser-vs-wasserstoffwasser' },
    { label: 'vs. Energy Drinks', href: '/vergleich/wasserstoffwasser-vs-energy-drinks' },
    { label: 'vs. Pre-Workout Booster', href: '/vergleich/wasserstoffwasser-vs-preworkoutbooster' }]

  },
  { label: 'FAQ', href: '/faq' }]

},
{
  label: 'Entdecken',
  subItems: [
  { label: 'Über AWAKE', href: '/about' },
  { label: 'Erfahrungsberichte', href: '/erfahrungsberichte' },
  { label: 'AWAKE Partner werden', href: '/partner' },
  { label: 'Kontakt', href: '/contact' }]

},
{ label: 'Kunden-Login', href: 'https://checkout.h2-awake.de/account/auth/login' }];


export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-nav-text transition-colors hover:bg-navy/5 active:bg-navy/10"
        aria-label="Menü öffnen">
        
        <Menu size={24} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isOpen &&
        <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
            onClick={close} />
          
            <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
            className="fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[380px] bg-white shadow-[0_0_60px_rgba(0,0,0,0.15)] z-[100] lg:hidden flex flex-col rounded-r-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation">
            
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <a
                href="/"
                onClick={close}
                className="font-gothic font-bold uppercase tracking-wider text-nav-text text-[28px] leading-none cursor-pointer">
                
                  AWAKE
                </a>
                <button
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full text-nav-text cursor-pointer transition-colors hover:bg-navy/5 active:bg-navy/10"
                aria-label="Menü schließen">
                
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain">
                <nav className="flex flex-col px-4 sm:px-5 font-gothic">
                  {mobileItems.map((item) =>
                <MobileNavItem
                  key={item.label}
                  item={item}
                  onClose={close} />

                )}
                </nav>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}

function MobileNavItem({
  item,
  onClose



}: {item: NavItem;onClose: () => void;}) {
  if (!item.subItems) {
    const href = item.href || '#';
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="py-4 text-nav-text font-gothic text-[16px] border-b border-gray-50 flex items-center transition-colors hover:text-awake-blue active:bg-navy/5 cursor-pointer">
          
          {item.label}
        </a>);

    }
    return (
      <a
        href={href}
        onClick={onClose}
        className="py-4 text-nav-text font-gothic text-[16px] border-b border-gray-50 flex items-center transition-colors hover:text-awake-blue active:bg-navy/5 cursor-pointer">
        
        {item.label}
      </a>);

  }

  return (
    <div className="border-b border-gray-50">
      <MobileAccordionItem item={item} onClose={onClose} depth={0} />
    </div>);

}

function MobileAccordionItem({
  item,
  onClose,
  depth




}: {item: {label: string;href?: string;subItems?: MobileSubItem[];};onClose: () => void;depth: number;}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.subItems) {
    const href = item.href || '#';
    const isExternal = href.startsWith('http');
    const baseClasses = `block font-gothic transition-colors cursor-pointer active:bg-navy/5 ${
    depth === 0 ?
    'py-4 text-[16px] text-nav-text hover:text-awake-blue' :
    'py-2.5 text-[15px] text-nav-text/70 hover:text-nav-text'}`;

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={baseClasses}>
          {item.label}
        </a>);

    }
    return (
      <a href={href} onClick={onClose} className={baseClasses}>
        {item.label}
      </a>);

  }

  const hasLinkAndSubItems = item.href && item.subItems;

  return (
    <div>
      <div
        className={`w-full flex items-center justify-between cursor-pointer active:bg-navy/5 transition-colors ${
        depth === 0 ?
        'py-4 text-nav-text font-gothic text-[16px]' :
        'py-2.5 text-nav-text/70 hover:text-nav-text font-gothic text-[15px]'}`
        }>
        
        {hasLinkAndSubItems ?
        <a
          href={item.href}
          onClick={onClose}
          className="flex flex-1 items-center text-left transition-colors hover:text-awake-blue">
          
            {item.label}
          </a> :

        <span className="flex flex-1 items-center">{item.label}</span>
        }
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-end shrink-0 cursor-pointer py-3 pl-3 pr-0"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Einklappen' : 'Aufklappen'}>
          
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 text-nav-text/40 ${
            isOpen ? 'rotate-180' : ''}`
            } />
          
        </button>
      </div>

      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden">
          
            <div className={`flex flex-col ${depth === 0 ? 'pb-3 pl-4' : 'pb-2 pl-4'}`}>
              {item.subItems.map((subItem) =>
            <MobileAccordionItem
              key={subItem.label}
              item={subItem}
              onClose={onClose}
              depth={depth + 1} />

            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}