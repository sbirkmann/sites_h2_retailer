import 'server-only'
import type {
  BlogtestPost,
  BlogtestListItem,
  BlogtestPostsResponse,
  BlogtestCategoryTreeItem,
  BlogtestTagListItem,
  BlogtestAuthor,
} from './types'

const API_BASE = 'https://h2vitaldash.x900.3az.de/api/cms'

// In-memory cache for static-ish data
const cache = new Map<string, { data: unknown; expires: number }>()

const CACHE_TTL = {
  categories: 60 * 60 * 1000, // 1 hour
  tags: 60 * 60 * 1000, // 1 hour
  slugs: 30 * 60 * 1000, // 30 min
  authors: 30 * 60 * 1000, // 30 min
}

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expires) {
    cache.delete(key)
    return undefined
  }
  return entry.data as T
}

function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expires: Date.now() + ttlMs })
}

async function fetchJson<T>(
  url: string,
  revalidateSeconds: number | false = 300,
): Promise<T | null> {
  try {
    const fetchOptions: RequestInit = {
      headers: { Accept: 'application/json' },
    }
    if (revalidateSeconds === false) {
      fetchOptions.cache = 'no-store'
    } else {
      fetchOptions.next = { revalidate: revalidateSeconds }
    }
    const res = await fetch(url, fetchOptions)
    if (!res.ok) {
      console.error(`Blogtest API error: ${res.status} ${res.statusText} for ${url}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`Blogtest API fetch error for ${url}:`, err)
    return null
  }
}

function toListItem(post: BlogtestPost): BlogtestListItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, assets, ...rest } = post
  // Prefer flat author_name if present; fall back to nested author.name
  if ((!rest.author_name || rest.author_name === '') && rest.author?.name) {
    rest.author_name = rest.author.name
  }
  return rest
}

export async function getBlogtestPosts(options?: {
  category?: string
  tag?: string
  search?: string
  page?: number
  perPage?: number
}): Promise<{ posts: BlogtestListItem[]; total: number }> {
  const params = new URLSearchParams()
  params.set('lang', 'de')
  params.set('per_page', String(options?.perPage || 50))
  params.set('page', String(options?.page || 1))
  params.set('include', 'featured_image')

  if (options?.category) {
    params.set('category', options.category)
  }
  if (options?.tag) {
    params.set('tag', options.tag)
  }
  if (options?.search) {
    params.set('search', options.search)
  }

  const url = `${API_BASE}/posts?${params.toString()}`
  const response = await fetchJson<BlogtestPostsResponse>(url, false)

  if (!response) {
    return { posts: [], total: 0 }
  }

  return {
    posts: response.data.map(toListItem),
    total: response.total,
  }
}

export async function getBlogtestPostBySlug(slug: string): Promise<BlogtestPost | null> {
  const url = `${API_BASE}/posts/${encodeURIComponent(slug)}?lang=de`
  return fetchJson<BlogtestPost>(url, false)
}

export async function getAllBlogtestSlugs(): Promise<string[]> {
  const cached = getCached<string[]>('slugs')
  if (cached) return cached

  const { posts } = await getBlogtestPosts({ perPage: 1000 })
  const slugs = posts.map((post) => post.slug)
  setCached('slugs', slugs, CACHE_TTL.slugs)
  return slugs
}

export async function getBlogtestCategories(): Promise<BlogtestCategoryTreeItem[]> {
  const cached = getCached<BlogtestCategoryTreeItem[]>('categories')
  if (cached) return cached

  const url = `${API_BASE}/categories?lang=de`
  const data = (await fetchJson<BlogtestCategoryTreeItem[]>(url, 3600)) || []
  setCached('categories', data, CACHE_TTL.categories)
  return data
}

export async function getBlogtestTags(): Promise<BlogtestTagListItem[]> {
  const cached = getCached<BlogtestTagListItem[]>('tags')
  if (cached) return cached

  const url = `${API_BASE}/tags?lang=de`
  const data = (await fetchJson<BlogtestTagListItem[]>(url, 3600)) || []
  setCached('tags', data, CACHE_TTL.tags)
  return data
}

export async function getBlogtestAuthors(): Promise<BlogtestAuthor[]> {
  const cached = getCached<BlogtestAuthor[]>('authors')
  if (cached) return cached

  const url = `${API_BASE}/authors`
  const data = (await fetchJson<BlogtestAuthor[]>(url, 1800)) || []
  setCached('authors', data, CACHE_TTL.authors)
  return data
}

export async function getBlogtestAuthorBySlug(
  slug: string,
): Promise<BlogtestAuthor | null> {
  const authors = await getBlogtestAuthors()
  return authors.find((author) => author.slug === slug) || null
}

export async function getBlogtestAuthorById(
  id: number | null | undefined,
): Promise<BlogtestAuthor | null> {
  if (id == null) return null
  const authors = await getBlogtestAuthors()
  return authors.find((author) => author.id === id) || null
}

export async function getAllBlogtestAuthorSlugs(): Promise<string[]> {
  const authors = await getBlogtestAuthors()
  return authors
    .map((a) => a.slug)
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
}

