export function blogImageUrl(url: string, width?: number): string {
  const params = new URLSearchParams()
  params.set('url', url)
  if (width) params.set('w', String(width))
  return `/api/blog-image?${params.toString()}`
}

export function blogImageSrcSet(
  url: string,
  widths: number[] = [400, 800, 1200]
): string {
  return widths
    .map((w) => `${blogImageUrl(url, w)} ${w}w`)
    .join(', ')
}
