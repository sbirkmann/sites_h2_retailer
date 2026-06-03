'use client'

import React, { useState, useEffect, useRef } from 'react'
import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { AnnouncementBar } from './announcement-bar'
import { useCart } from '@/lib/CartContext'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const SCROLL_DELTA = 5

export function Header() {
  const { totalItems, toggleCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hideAnnouncement, setHideAnnouncement] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastScrollY.current

        setIsScrolled(y > 10)

        if (delta > SCROLL_DELTA && y > 80) {
          setHideAnnouncement(true)
        } else if (delta < -SCROLL_DELTA) {
          setHideAnnouncement(false)
        }

        lastScrollY.current = y
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-[margin-top] duration-300 ease-in-out ${
          hideAnnouncement ? '-mt-[40px]' : ''
        }`}
      >
        <AnnouncementBar />

        <div
          className={`w-full transition-[background-color,box-shadow] duration-300 ease-in-out ${
            isScrolled
              ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
              : 'bg-white'
          }`}
        >
          <div
            className={`mx-auto px-3 sm:px-4 lg:px-6 max-w-[1498px] transition-[padding] duration-300 ${
              isScrolled ? 'py-1 md:py-2' : 'py-2 md:py-3'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 lg:hidden">
                <MobileNav />
              </div>

              <div className="hidden lg:flex flex-1 justify-start">
                <DesktopNav group="left" />
              </div>

              <div className="flex-shrink-0 flex justify-center items-center px-6 lg:px-10">
                <Link href="/" className="inline-block ml-1 sm:ml-2 md:ml-0 cursor-pointer">
                  <img alt="AWAKE Logo - Wasserstoff-Wasser"
                    src="/awake-logo.png"
                    title="AWAKE Logo - Wasserstoff-Wasser"
                    className={`object-contain transition-all duration-300 ${
                      isScrolled ? 'h-[32px] sm:h-[36px]' : 'h-[38px] sm:h-[44px]'
                    }`}
                  />
                </Link>
              </div>


              <div className="flex-1 flex justify-end items-center gap-6">
                <div className="hidden lg:flex">
                  <DesktopNav group="right" />
                </div>

                {/* Shopping Cart Button */}
                <button
                  onClick={toggleCart}
                  aria-label="Warenkorb öffnen"
                  className="relative p-2 text-[#173A57] hover:text-[#173A57]/60 transition-colors cursor-pointer flex items-center"
                >
                  <ShoppingBag size={24} strokeWidth={2} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-[#FDF277] text-[#173A57] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm font-gothic animate-badge-pulse">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[64px] sm:h-[72px] md:h-[76px]" />
    </>
  )
}

