import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { SubblyScript } from "@/lib/subbly/subbly-script";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { ConditionalCapiTracker } from "@/components/layout/conditional-capi-tracker";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/json-ld-schemas";

const introRust = localFont({
  src: "../fonts/IntroRust.otf",
  variable: "--font-intro-rust",
  weight: "400",
  style: "normal",
  display: "swap",
});

const centuryGothic = localFont({
  src: [
    {
      path: "../fonts/centurygothic.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/centurygothic_bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-century-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://h2-awake.de"),
  title: "AWAKE Händler & B2B-Partner werden | H₂-Wasser in Europa",
  description:
    "Werde AWAKE B2B-Partner: Biete deinen Kunden das Nr. 1 H₂-Wasser in Europa an. Attraktive Händler-Konditionen für Fitness, Longevity, Praxen & Hotels.",
  openGraph: {
    title: "AWAKE Händler & B2B-Partner werden | H₂-Wasser in Europa",
    description: "Werde AWAKE B2B-Partner: Biete deinen Kunden das Nr. 1 H₂-Wasser in Europa an. Attraktive Händler-Konditionen für Fitness, Longevity, Praxen & Hotels.",
    url: "https://h2-awake.de/partner",
    siteName: "AWAKE B2B Partner Portal",
    images: [
      {
        url: "/awake-logo.png",
        width: 1200,
        height: 630,
        alt: "AWAKE Logo",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWAKE Händler & B2B-Partner werden | H₂-Wasser in Europa",
    description: "Werde AWAKE B2B-Partner: Biete deinen Kunden das Nr. 1 H₂-Wasser in Europa an. Attraktive Händler-Konditionen für Fitness, Longevity, Praxen & Hotels.",
    images: ["/awake-logo.png"],
  },
};

//Never remove this.
export const revalidate = 600;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="dns-prefetch" href="https://assets.subbly.co" />
        <link rel="preconnect" href="https://assets.subbly.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.goaffpro.com" />
        <link rel="preconnect" href="https://api.goaffpro.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://h2-awake.de" />
        <link rel="preconnect" href="https://h2-awake.de" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/hero-slide-1.webp" type="image/webp" fetchPriority="high" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema("/")) }}
        />
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ("scrollRestoration" in history) {
                  history.scrollRestoration = "manual";
                }
                window.addEventListener("pageshow", function(e) {
                  if (!e.persisted) {
                    window.scrollTo(0, 0);
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${centuryGothic.variable} ${introRust.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            {process.env.NEXT_PUBLIC_SUBBLY_API_KEY && (
              <SubblyScript
                apiKey={process.env.NEXT_PUBLIC_SUBBLY_API_KEY}
              />
            )}
            <Script
              id="goaffpro"
              src="https://api.goaffpro.com/loader.js?shop=oyqbjkvocu"
              strategy="lazyOnload"
            />
            <ConditionalCapiTracker />
            <ScrollToTop />
            <CookieBanner />
            <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
              <Navbar />
              <div className="relative flex-grow h-full">
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
