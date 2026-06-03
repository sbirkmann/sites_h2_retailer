"use client";

import { useState, useEffect } from "react";
import { reviews } from "@/components/reviews/reviews-data";
import { ReviewCard } from "@/components/reviews/reviews-content";
import { ReviewsAmbassadorsSection } from "@/components/reviews/ambassadors-section";
import { CommunitySection } from "@/components/home/community-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  reviewPageSchema,
  organizationSchema,
  webPageSchema,
  breadcrumbListSchema,
} from "@/lib/json-ld-schemas";

import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ContactWidget from "@/components/ContactWidget";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";

function ErfahrungsberichteContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={reviewPageSchema([
          {
            author: "Sarah M.",
            reviewBody:
              "Seit ich AWAKE regelmäßig trinke, gehört es für mich fest zu meiner täglichen Routine und ich fühle mich damit im Alltag sehr wohl.",
            reviewRating: 5,
            datePublished: "2025-01-15",
          },
          {
            author: "Dr. Martin B.",
            reviewBody:
              "Ich beschäftige mich beruflich viel mit Gesundheitsthemen und finde den Ansatz hinter molekularem Wasserstoff wirklich spannend. Vor allem die hohe H₂-Konzentration hat mich neugierig gemacht.",
            reviewRating: 5,
            datePublished: "2025-02-03",
          },
          {
            author: "Thomas K.",
            reviewBody:
              "Das einzige Getränk, das mich spürbar besser fühlen lässt – und das täglich. Ich habe definitiv einen Anstieg an Energie und Fokus bemerkt.",
            reviewRating: 5,
            datePublished: "2025-01-22",
          },
          {
            author: "Anna S.",
            reviewBody:
              "Ich trinke AWAKE inzwischen seit einigen Monaten regelmäßig. Vor allem im stressigen Alltag greife ich mittlerweile automatisch dazu.",
            reviewRating: 5,
            datePublished: "2024-12-10",
          },
          {
            author: "Michael R.",
            reviewBody:
              "Mein Trainingspensum hat sich verbessert. Eine nachhaltige Steigerung der Leistungsfähigkeit. Die Regeneration nach dem Sport ist deutlich besser geworden.",
            reviewRating: 5,
            datePublished: "2025-03-01",
          },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: "Erfahrungen mit AWAKE | Das sagen unsere Kunden",
          description:
            "Lies echte Erfahrungsberichte über AWAKE. Wie molekularer Wasserstoff unseren Kunden zu mehr Energie, besserem Schlaf und schnellerer Regeneration verhilft.",
          url: "/erfahrungsberichte",
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Startseite", url: "/" },
          { name: "Erfahrungsberichte", url: "/erfahrungsberichte" },
        ])}
      />

      <main
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
          backgroundColor: "#ffffff",
          color: "#173A57",
          overflowX: "clip",
        }}
        className="min-h-screen bg-white font-gothic antialiased"
      >
        <Navbar />
        <CartDrawer />
        <ContactWidget />

        <section className="text-base font-normal leading-none bg-[#F5F5F5] rounded-none pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
          <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
            <div className="text-center">
              <span className="inline-block bg-[#173A57] text-white text-[13px] sm:text-[14px] font-bold px-5 py-1.5 rounded-full mb-4 font-gothic">
                Erfahrungsberichte
              </span>
              <h1 className="font-gothic text-[28px] font-bold text-navy mb-4 sm:mb-5 sm:text-[36px] lg:text-[44px] uppercase">
                Das sagen unsere Kunden
              </h1>
              <p className="font-gothic sm:text-[16px] text-navy/60 max-w-lg mx-auto text-base font-normal leading-snug">
                Über 3.000+ zufriedene Kunden vertrauen bereits auf die Kraft von AWAKE.
              </p>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 lg:mt-14">
            <ReviewsAmbassadorsSection />
          </div>

          <div className="mx-auto max-w-[1350px] px-4 lg:px-8 mt-14 sm:mt-16 lg:mt-20">
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-5">
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </section>

        <CommunitySection />
        
        <Footer />
      </main>
    </>
  );
}

export default function ErfahrungsberichteClient() {
  return (
    <CartProvider>
      <ErfahrungsberichteContent />
    </CartProvider>
  );
}
