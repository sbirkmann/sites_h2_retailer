/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "https://h2-awake.de"

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "H2 Vital GmbH",
  alternateName: "AWAKE – Wasserstoff-Wasser",
  url: BASE_URL,
  logo: `${BASE_URL}/images/awake-logo.png`,
  description:
    "AWAKE – Deutschlands erstes Wasserstoff-Wasser. H₂-reicher Wasserstoff-Wasser-Drink für Energie, Fokus und Regeneration.",
  sameAs: [
    "https://www.instagram.com/awakeh2vital/",
    "https://www.youtube.com/channel/UCk3r0K9x5Y0L9K9x5Y0L9K9",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@h2-vital.de",
    areaServed: "DE",
    availableLanguage: ["German"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rykestrasse 26",
    addressLocality: "Berlin",
    postalCode: "10405",
    addressCountry: "DE",
  },
}

export function organizationSchema(): Record<string, any> {
  return ORGANIZATION
}

export function websiteSchema(
  searchUrl: string,
  name = "AWAKE – Wasserstoff-Wasser"
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    name,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}${searchUrl}`,
      "query-input": "required name=q",
    },
  }
}

export function localBusinessSchema(): Record<string, any> {
  return {
    ...ORGANIZATION,
    "@type": "LocalBusiness",
    priceRange: "€€",
    paymentAccepted: ["PayPal", "Kreditkarte", "Klarna", "SEPA-Lastschrift"],
    currenciesAccepted: "EUR",
  }
}

export function productSchema({
  name,
  description,
  image,
  brand = "AWAKE",
  offers,
  review,
  sku,
}: {
  name: string
  description: string
  image: string
  brand?: string
  offers: Record<string, any> | Record<string, any>[]
  review?: Record<string, any>
  sku?: string
}): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    sku,
    url: `${BASE_URL}/produkte`,
    offers,
    ...(review ? { review } : {}),
  }
}

export function offerSchema({
  url,
  price,
  priceCurrency = "EUR",
  availability = "https://schema.org/InStock",
  priceValidUntil,
  itemOffered,
}: {
  url: string
  price: number | string
  priceCurrency?: string
  availability?: string
  priceValidUntil?: string
  itemOffered?: string
}): Record<string, any> {
  const offer: Record<string, any> = {
    "@type": "Offer",
    url,
    price,
    priceCurrency,
    availability,
    seller: {
      "@type": "Organization",
      name: "H2 Vital GmbH",
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnLink: `${BASE_URL}/returns`,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "EUR",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "DE",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 1,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 3,
          unitCode: "DAY",
        },
      },
    },
  }
  if (priceValidUntil) offer.priceValidUntil = priceValidUntil
  if (itemOffered) offer.itemOffered = itemOffered
  return offer
}

export function aggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
}: {
  ratingValue: number | string
  reviewCount: number | string
  bestRating?: number | string
}): Record<string, any> {
  return {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount,
    bestRating,
  }
}

export function faqPageSchema(
  questions: { question: string; answer: string }[]
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }
}

export function aboutPageSchema(
  description: string,
  image?: string
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Über uns – H2 Vital GmbH",
    description,
    url: `${BASE_URL}/about`,
    image,
    mainEntity: ORGANIZATION,
  }
}

export function contactPageSchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt – H2 Vital GmbH",
    url: `${BASE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "H2 Vital GmbH",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@h2-vital.de",
        areaServed: "DE",
        availableLanguage: ["German"],
      },
    },
  }
}

export function blogSchema(name: string, description: string): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url: `${BASE_URL}/blog`,
    publisher: ORGANIZATION,
  }
}

export function blogPostingSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
}): Record<string, any> {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url: `${BASE_URL}${url}`,
    datePublished,
    publisher: ORGANIZATION,
  }
  if (image) data.image = image
  if (dateModified) data.dateModified = dateModified
  if (author)
    data.author = {
      "@type": "Person",
      name: author,
    }
  return data
}

export function articleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
}): Record<string, any> {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${BASE_URL}${url}`,
    datePublished,
    publisher: ORGANIZATION,
  }
  if (image) data.image = image
  if (dateModified) data.dateModified = dateModified
  if (author)
    data.author = {
      "@type": "Person",
      name: author,
    }
  return data
}

export function personSchema({
  name,
  jobTitle,
  description,
  image,
  url,
  sameAs = [],
  knowsAbout = [],
}: {
  name: string
  jobTitle?: string
  description: string
  image?: string
  url: string
  sameAs?: string[]
  knowsAbout?: string[]
}): Record<string, any> {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    url: `${BASE_URL}${url}`,
  }
  if (jobTitle) data.jobTitle = jobTitle
  if (image) data.image = image
  if (sameAs.length) data.sameAs = sameAs
  if (knowsAbout.length) data.knowsAbout = knowsAbout
  return data
}

export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  eventStatus,
  eventAttendanceMode,
  location,
  image,
  url,
  performer,
  offers,
}: {
  name: string
  description: string
  startDate: string
  endDate?: string
  eventStatus?: string
  eventAttendanceMode?: string
  location?: Record<string, any>
  image?: string
  url: string
  performer?: Record<string, any>
  offers?: Record<string, any>
}): Record<string, any> {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url: `${BASE_URL}${url}`,
    startDate,
    organizer: ORGANIZATION,
  }
  if (endDate) data.endDate = endDate
  if (eventStatus) data.eventStatus = eventStatus
  if (eventAttendanceMode) data.eventAttendanceMode = eventAttendanceMode
  if (location) data.location = location
  if (image) data.image = image
  if (performer) data.performer = performer
  if (offers) data.offers = offers
  return data
}

export function reviewPageSchema(
  reviews: {
    author: string
    reviewBody: string
    reviewRating: number | string
    datePublished: string
  }[]
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "ReviewPage",
    url: `${BASE_URL}/erfahrungsberichte`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: reviews.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: r.author,
          },
          reviewBody: r.reviewBody,
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.reviewRating,
            bestRating: 5,
          },
          datePublished: r.datePublished,
          publisher: ORGANIZATION,
        },
      })),
    },
  }
}

export function collectionPageSchema(
  name: string,
  description: string,
  url: string
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}${url}`,
    publisher: ORGANIZATION,
  }
}

export function webPageSchema({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${BASE_URL}${url}`,
    publisher: ORGANIZATION,
  }
}

export function breadcrumbListSchema(
  items: { name: string; url: string }[]
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}
