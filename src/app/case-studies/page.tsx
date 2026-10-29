import type { Metadata } from "next";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import CaseStudyGrid from "@/components/CaseStudyGrid";

export const metadata: Metadata = {
  title: "Case Studies — OP Dev.",
  description: "Evidence of OP DEV's work, approach, capabilities and results across services and industries.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
          title="Work that"
          accent="moves organizations."
          description="Each project is told through the challenge, OP DEV's contribution, and the outcome — filter by industry, service or project type."
        />
        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <CaseStudyGrid />
        </Reveal>
        <CtaBand
          title="Your project"
          accent="could be next."
          body="Tell us what you're working on and we'll show you how we'd approach it."
        />
      </main>
      <SiteFooter />
    </>
  );
}
