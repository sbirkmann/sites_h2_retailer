export type JsonLdData = Record<string, unknown>

interface JsonLdProps {
  data: JsonLdData | JsonLdData[]
}

export function JsonLd({ data }: JsonLdProps) {
  const scriptContent = JSON.stringify(
    Array.isArray(data) ? data : data,
    null,
    0,
  )

  const id = `json-ld-${scriptContent.length}-${scriptContent.slice(20, 30)}`

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
}
