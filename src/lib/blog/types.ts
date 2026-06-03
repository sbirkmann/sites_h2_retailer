export type BlogtestFeaturedImage = {
  id: number
  disk: string
  path: string
  alt_text: string | null
  title: string | null
  url: string
}

export type BlogtestAsset = {
  id: number | string
  url: string
  is_virtual?: boolean
}

export type BlogtestAuthorImage = {
  id: number
  disk?: string
  path?: string
  alt_text?: string | null
  title?: string | null
  url: string
  is_image?: boolean
}

export type BlogtestAuthor = {
  id: number
  name: string
  slug?: string
  job_title?: string | null
  short_info?: string | null
  image_id?: number | null
  image_virtual_id?: string | null
  content?: string | null
  show_author_box?: boolean
  layout_iterating?: boolean
  created_at?: string
  updated_at?: string
  assets?: BlogtestAsset[]
  image?: BlogtestAuthorImage | null
}

export type BlogtestCategory = {
  id: number
  name: string
  slug: string
}

export type BlogtestTag = {
  id: number
  name: string
  slug: string
}

export type BlogtestPost = {
  id: number
  language_code: string
  translation_group_id: number | null
  title: string
  slug: string
  excerpt: string
  meta_title?: string | null
  meta_description?: string | null
  content: string
  featured_image_id: number
  featured_image_virtual_id?: string | null
  author_id?: number
  author_name?: string | null
  cms_author_id?: number | null
  status: string
  published_at: string
  category_id: number
  created_at: string
  updated_at: string
  author: BlogtestAuthor
  category: BlogtestCategory
  tags: BlogtestTag[]
  featured_image: BlogtestFeaturedImage | null
  assets: BlogtestAsset[]
  layout_iterating?: boolean
}

export type BlogtestListItem = Omit<BlogtestPost, 'content' | 'assets'>

export type BlogtestCategoryTreeItem = {
  id: number
  parent_id: number | null
  name: string
  slug: string
  description: string | null
  is_primary: boolean | number
  sort_order: number
  created_at: string
  updated_at: string
  children: BlogtestCategoryTreeItem[]
}

export type BlogtestTagListItem = {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
  posts_count: number
}

export type BlogtestPostsResponse = {
  current_page: number
  data: BlogtestPost[]
  first_page_url: string
  last_page: number
  per_page: number
  total: number
}
