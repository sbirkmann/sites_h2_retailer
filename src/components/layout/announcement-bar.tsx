'use client'

import React from 'react'

export function AnnouncementBar() {
  return (
    <div className="w-full bg-awake-blue h-[40px] flex items-center px-3 sm:px-4 lg:px-6 hidden">
      <div className="mx-auto w-full max-w-[1498px] flex justify-between items-center">
        <div className="w-[80px] hidden sm:block" />

        <div className="flex-1 text-center">
          <p suppressHydrationWarning className="text-white text-[12px] sm:text-[13px] font-gothic tracking-[0.15em] uppercase inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cta-yellow shadow-[0_0_6px_2px_rgba(253,242,119,0.6)] animate-pulse" />
            SPARE 20% + KOSTENLOSER VERSAND
          </p>
        </div>

      </div>
    </div>
  )
}
