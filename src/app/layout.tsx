import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "AWAKE Retailer – B2B Wasserstoff Wasser Portal",
  description: "Offizielles B2B Retailer Portal für AWAKE Wasserstoffwasser. Premium-Produkte mit bis zu 300% Marge für Händler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${centuryGothic.variable} ${introRust.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
