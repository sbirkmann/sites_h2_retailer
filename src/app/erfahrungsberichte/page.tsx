import type { Metadata } from "next";
import ErfahrungsberichteClient from "./ErfahrungsberichteClient";

export const metadata: Metadata = {
  alternates: { canonical: "/erfahrungsberichte" },
  title: "Erfahrungen mit AWAKE | Das sagen unsere Kunden",
  description:
    "Lies echte Erfahrungsberichte über AWAKE. Wie molekularer Wasserstoff unseren Kunden zu mehr Energie, besserem Schlaf und schnellerer Regeneration verhilft."
};

export default function ErfahrungsberichtePage() {
  return <ErfahrungsberichteClient />;
}
