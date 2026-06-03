'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export interface DropdownItem {
  label: string
  href?: string
  subItems?: { label: string; href: string }[]
}

interface DropdownMenuProps {
  isOpen: boolean
  items: DropdownItem[]
  onClose: () => void
  align?: 'left' | 'right'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function DropdownMenu({ isOpen, items, onClose, align = 'left', onMouseEnter, onMouseLeave }: DropdownMenuProps) {
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={`absolute top-full z-50 pt-2 ${align === 'right' ? 'right-0' : 'left-0'}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="bg-white border border-border shadow-[0_4px_24px_rgba(23,58,87,0.08)] rounded-sm py-1.5 flex flex-col min-w-[220px]">
            {items.map((item) => {
              if (item.subItems) {
                return (
                  <SubDropdownItem
                    key={item.label}
                    item={item}
                    onClose={onClose}
                  />
                )
              }
              const isActive = pathname === item.href || (item.href && item.href.includes('#') && pathname === item.href.split('#')[0])
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`px-5 py-2.5 text-[15px] font-gothic transition-colors whitespace-nowrap block cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-nav-text hover:bg-gray-50 hover:text-nav-text/80'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SubDropdownItem({ item, onClose }: { item: DropdownItem; onClose: () => void }) {
  const [isSubOpen, setIsSubOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const handleSubMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsSubOpen(true)
  }, [])

  const handleSubMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsSubOpen(false)
    }, 150)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const hasActiveSub = item.subItems?.some((sub) => pathname === sub.href)

  return (
    <div
      className="relative"
      onMouseEnter={handleSubMouseEnter}
      onMouseLeave={handleSubMouseLeave}
    >
      {item.href ? (
        <a
          href={item.href}
          onClick={onClose}
          className={`px-5 py-2.5 text-[15px] font-gothic transition-colors whitespace-nowrap flex items-center justify-between w-full cursor-pointer ${
            hasActiveSub
              ? 'text-primary bg-primary/5'
              : 'text-nav-text hover:bg-gray-50 hover:text-nav-text/80'
          }`}
        >
          {item.label}
          <ChevronRight size={14} className="ml-3 opacity-60" />
        </a>
      ) : (
        <button
          className={`px-5 py-2.5 text-[15px] font-gothic transition-colors whitespace-nowrap flex items-center justify-between w-full cursor-pointer ${
            hasActiveSub
              ? 'text-primary bg-primary/5'
              : 'text-nav-text hover:bg-gray-50 hover:text-nav-text/80'
          }`}
        >
          {item.label}
          <ChevronRight size={14} className="ml-3 opacity-60" />
        </button>
      )}
      <AnimatePresence>
        {isSubOpen && item.subItems && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-full top-0 z-50 ml-1"
          >
            <div className="bg-white border border-border shadow-[0_4px_24px_rgba(23,58,87,0.08)] rounded-sm py-1.5 flex flex-col min-w-[220px]">
              {item.subItems.map((sub) => {
                const isActive = pathname === sub.href
                return (
                  <a
                    key={sub.label}
                    href={sub.href}
                    onClick={onClose}
                    className={`px-5 py-2.5 text-[15px] font-gothic transition-colors whitespace-nowrap block cursor-pointer ${
                      isActive
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-nav-text hover:bg-gray-50 hover:text-nav-text/80'
                    }`}
                  >
                    {sub.label}
                  </a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
