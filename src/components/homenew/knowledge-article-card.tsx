"use client"

import { ArrowRight } from "lucide-react"
import type { BlogtestListItem } from "@/lib/blog/types"

export function KnowledgeArticleCard({ post }: { post: BlogtestListItem; index: number }) {
  const imageUrl = post.featured_image?.url
  const imageAlt = post.featured_image?.title || post.title

  return (
    <a
      href={`/blog/${post.slug}`}
      aria-label={`${post.title}${post.excerpt ? ` – ${post.excerpt}` : ""}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-yellow focus-visible:ring-offset-2 rounded-lg"
    >
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden cursor-pointer group">
        {imageUrl && (
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={imageAlt}
              src={imageUrl}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-[#173A57]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
          <div className="h-[2px] bg-cta-yellow rounded-full mb-4 w-8 opacity-60 transition-all duration-300 group-hover:w-[50px] group-hover:opacity-100" />

          <h3 className="font-gothic font-bold text-[16px] text-white mb-3 sm:text-[18px] uppercase tracking-wide leading-snug">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="font-gothic text-[13px] text-white/80 leading-relaxed sm:text-[14px] line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 mt-5 transition-transform duration-300 group-hover:translate-x-1">
            <span className="font-gothic text-[13px] font-bold text-cta-yellow">LESEN</span>
            <ArrowRight className="w-4 h-4 text-cta-yellow" />
          </div>
        </div>
      </div>
    </a>
  )
}
