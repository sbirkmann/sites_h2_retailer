'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'

import { ChevronDown } from 'lucide-react'
import { MegaMenu } from './mega-menu'
import { DropdownMenu } from './dropdown-menu'

interface NavItem {
  label: string
  href?: string
  hasMegaMenu?: boolean
  hasDropdown?: boolean
  dropdownItems?: { label: string; href?: string; subItems?: { label: string; href: string }[] }[]
  align?: 'left' | 'right'
}

const leftNavItems: NavItem[] = [
  { label: 'Shop', hasMegaMenu: true },
  {
    label: 'H₂ Wissen',
    hasDropdown: true,
    align: 'left',
    dropdownItems: [
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
          { label: 'vs. Pre-Workout Booster', href: '/vergleich/wasserstoffwasser-vs-preworkoutbooster' },
        ],
      },
      { label: 'FAQ', href: '/faq' },
    ],
  },
]

const rightNavItems: NavItem[] = [
  {
    label: 'Entdecken',
    hasDropdown: true,
    align: 'right',
    dropdownItems: [
      { label: 'Über AWAKE', href: '/about' },
      { label: 'Erfahrungsberichte', href: '/erfahrungsberichte' },
      { label: 'AWAKE Partner werden', href: '/partner' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
  { label: 'Kunden-Login', href: 'https://checkout.h2-awake.de/account/auth/login' },
]

export function DesktopNav({ group }: { group: 'left' | 'right' }) {
  const items = group === 'left' ? leftNavItems : rightNavItems

  return (
    <nav className="flex items-center gap-8 lg:gap-10">
      {items.map((item) => (
        <NavItemComponent key={item.label} item={item} />
      ))}
    </nav>
  )
}

function NavItemComponent({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isInteractive = item.hasMegaMenu || item.hasDropdown

  const close = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={isInteractive ? handleMouseEnter : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
    >
      {item.href ? (
        <a
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-nav-text text-[15px] font-bold font-gothic relative group py-4 flex items-center gap-1 transition-colors hover:text-nav-text/60 lg:text-[16px] cursor-pointer"
        >
          {item.label}
          <span className="absolute bottom-3 left-0 w-0 h-[1px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
        </a>
      ) : (
        <button
          className={`text-nav-text text-[15px] font-bold font-gothic relative group py-4 flex items-center gap-1 cursor-pointer transition-colors lg:text-[16px] ${
            isOpen ? 'text-nav-text' : 'hover:text-nav-text/60'
          }`}
          aria-expanded={isInteractive ? isOpen : undefined}
          aria-haspopup={isInteractive ? true : undefined}
        >
          {item.label}
          {isInteractive && (
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
          <span
            className={`absolute bottom-3 left-0 h-[1px] bg-[#173A57] transition-all duration-300 ${
              isOpen ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </button>
      )}

      {item.hasMegaMenu && <MegaMenu isOpen={isOpen} onClose={close} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />}
      {item.hasDropdown && item.dropdownItems && (
        <DropdownMenu
          isOpen={isOpen}
          items={item.dropdownItems}
          onClose={close}
          align={item.align}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  )
}
