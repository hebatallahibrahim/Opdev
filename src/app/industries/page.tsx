import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import WorkVisual from "@/components/WorkVisual";
import { INDUSTRIES } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries — OP Dev.",
  description:
    "How OP DEV connects its capabilities to the operational, digital, communication and growth needs of eleven sectors.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
          title="Built for the way"
          accent="your sector works."
          description="Every sector has its own challenges, audiences and pace. Explore how OP DEV's integrated capabilities apply to yours."
        />

        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="t-h2 font-bold">
              <span className="mask">
                <span data-rise>Eleven sectors.</span>
              </span>
              <span className="mask">
                <span data-rise className="accent text-brand">
                  One integrated partner.
                </span>
              </span>
            </h2>
            <p data-fade className="max-w-sm text-[16px] leading-relaxed text-ink/70">
              Hover any card — each visual shows how OP DEV approaches that sector.
            </p>
          </div>

          <div data-stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((ind, i) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                data-cursor="View"
                className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper-2/50 transition-colors duration-500 hover:border-brand"
              >
                <div className="aspect-[4/3]">
                  <WorkVisual kind={ind.visual.kind} config={ind.visual.config} label={ind.name} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.03em]">{ind.name}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{ind.line}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-semibold text-brand">
                    Explore sector
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        <CtaBand
          title="Don't see your sector?"
          accent="Let's talk anyway."
          body="OP DEV works with corporate companies, startups, NGOs and organizations across industries and markets."
        />
      </main>
      <SiteFooter />
    </>
  );
}
