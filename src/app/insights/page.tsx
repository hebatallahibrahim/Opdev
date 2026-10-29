import type { Metadata } from "next";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import InsightsGrid from "@/components/insights/InsightsGrid";

export const metadata: Metadata = {
  title: "Insights & Resources — OP Dev.",
  description:
    "Practical guides, frameworks and perspectives that help decision-makers understand challenges, evaluate options and make better business decisions.",
};

export default function InsightsPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
          title="Thinking for"
          accent="decision-makers."
          description="Practical guides, frameworks and perspectives on strategy, marketing, technology, media and growth — written to help you decide, not to sell."
        />
        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <InsightsGrid />
        </Reveal>
        <CtaBand
          title="Have a question"
          accent="we should write about?"
          body="Tell us the challenge you're facing — we'll answer it directly, and it may become our next guide."
        />
      </main>
      <SiteFooter />
    </>
  );
}
