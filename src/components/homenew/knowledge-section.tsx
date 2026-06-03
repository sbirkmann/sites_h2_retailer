import { ArrowRight } from "lucide-react"
import { getBlogtestPosts } from "@/lib/blog/api"
import type { BlogtestListItem } from "@/lib/blog/types"
import { KnowledgeArticleCard } from "@/components/homenew/knowledge-article-card"

export async function KnowledgeSection() {
  let posts: BlogtestListItem[] = []
  try {
    const result = await getBlogtestPosts({ perPage: 10 })
    posts = result.posts
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 3)
  } catch {
    return <></>
  }

  if (posts.length === 0) {
    return <></>
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 lg:px-8 bg-white">
      <div className="mx-auto max-w-[1350px]">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-gothic text-[24px] font-bold text-[#173A57] mb-4 sm:text-[30px] lg:text-[36px]">
            WISSENSWERTES
          </h2>
          <p className="text-[14px] text-[#173A57] max-w-lg mx-auto">
            Mehr als nur ein Trend – Mit AWAKE revolutionieren wir das Trinkerlebnis und
            bringen die Vorteile von Wasserstoff in deinen Alltag.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {posts.map((post, idx) => (
            <KnowledgeArticleCard key={post.id} post={post} index={idx} />
          ))}
        </div>

        <div className="mt-12 text-center sm:mt-16">
          <a
            href="/blog"
            className="inline-flex items-center gap-3 rounded-full border border-awake-blue bg-awake-blue px-7 py-3.5 font-gothic text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0f2c44] hover:border-[#0f2c44] cursor-pointer sm:text-[14px]"
          >
            Alle Artikel entdecken
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
