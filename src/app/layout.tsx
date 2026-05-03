import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

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
    <html lang="de">
      <body className={jost.className}>
        {children}
      </body>
    </html>
  );
}
