import type { Metadata } from "next";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import SiteFooter from "@/components/SiteFooter";
import ServicesHub from "@/components/services/ServicesHub";

export const metadata: Metadata = {
  title: "Services — OP Dev.",
  description:
    "Integrated outsourcing services and investment & business growth support for businesses and organizations.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <ServicesHub />
      </main>
      <SiteFooter />
    </>
  );
}
