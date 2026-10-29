import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import WorkVisual from "@/components/WorkVisual";
import { CASE_STUDIES, SAMPLE_NOTICE, caseBySlug } from "@/content/caseStudies";
import { industryBySlug } from "@/content/industries";
import { categoryById } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  return c ? { title: `${c.title} — OP Dev.`, description: c.overview } : {};
}

// Numbered section heading, following the brief's case study structure (1–8).
function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="accent text-xl text-brand">{String(n).padStart(2, "0")}</span>
      <h2 className="eyebrow text-ink/55">{title}</h2>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();

  const industry = industryBySlug(c.industry);
  const related = c.services.map(categoryById).filter((s) => !!s);
  const next = CASE_STUDIES[(CASE_STUDIES.indexOf(c) + 1) % CASE_STUDIES.length];

  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Case Studies", href: "/case-studies" }, { label: c.client }]}
          title={c.title}
          description={c.overview}
          actions={
            <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-[13px] sm:grid-cols-4">
              {[
                ["Client", c.client],
                ["Industry", industry?.name ?? ""],
                ["Service", c.service],
                ["Project type", c.projectType],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-[10px] text-paper/40">{k}</dt>
                  <dd className="mt-1 text-paper/85">{v}</dd>
                </div>
              ))}
            </dl>
          }
          visual={
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
              <WorkVisual kind={c.visual} label={c.title} />
            </div>
          }
        />

        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <p data-fade className="mb-14 rounded-full border border-dashed border-ink/20 px-5 py-3 text-center text-[13px] text-ink/55">
            {SAMPLE_NOTICE}
          </p>

          {/* 01 overview + 02 background + 03 objectives */}
          <div className="grid gap-14 lg:grid-cols-12">
            <div data-fade className="lg:col-span-5">
              <Step n={1} title="Project overview" />
              <p className="mt-5 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-[1.9rem]">{c.overview}</p>
            </div>
            <div data-fade className="lg:col-span-6 lg:col-start-7">
              <Step n={2} title="Background & business challenge" />
              <p className="mt-5 text-[16px] leading-relaxed text-ink/65">{c.background}</p>
              <div className="mt-12">
                <Step n={3} title="Objectives & requirements" />
                <ul className="mt-5 space-y-3">
                  {c.objectives.map((o) => (
                    <li key={o} className="flex gap-3 text-[16px] font-medium">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 04 approach */}
          <div className="mt-20 border-t border-ink/10 pt-16 md:mt-28">
            <Step n={4} title="Strategy & approach" />
            <ol data-stagger className="mt-10 grid gap-4 md:grid-cols-3">
              {c.approach.map((a, i) => (
                <li key={a} className="relative rounded-[1.25rem] bg-paper-2/70 p-6">
                  <span className="text-[11px] tabular-nums text-ink/40">Phase {i + 1}</span>
                  <p className="mt-6 text-[17px] font-medium leading-snug">{a}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* 05 solutions + 06 tools */}
          <div className="mt-20 grid gap-14 border-t border-ink/10 pt-16 md:mt-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Step n={5} title="Solutions delivered by OP DEV" />
              <ul data-stagger className="mt-8 grid gap-3 sm:grid-cols-2">
                {c.solutions.map((s) => (
                  <li key={s} className="rounded-[1.25rem] bg-ink px-5 py-5 text-[16px] font-medium text-paper">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Step n={6} title="Tools, systems & channels" />
              <ul className="mt-8 flex flex-wrap gap-2">
                {c.tools.map((t) => (
                  <li key={t} className="rounded-full border border-ink/15 px-4 py-2 text-[13px]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 07 results + 08 related services */}
          <div className="mt-20 grid gap-14 border-t border-ink/10 pt-16 md:mt-28 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Step n={7} title="Results & outcomes" />
              <ul className="mt-8 space-y-4">
                {c.results.map((r) => (
                  <li key={r} className="flex items-center gap-4 text-[18px] font-semibold tracking-[-0.01em]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-[13px] text-white">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] text-ink/45">Quantified results are published only once verified with the client.</p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Step n={8} title="Related services" />
              <ul className="mt-8 space-y-2">
                {related.map(({ line, category }) => (
                  <li key={category.id}>
                    <Link
                      href={`/services/${line.slug}#${category.id}`}
                      className="group flex items-center justify-between rounded-2xl border border-ink/10 px-5 py-4 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      <span className="font-semibold">{category.title}</span>
                      <span className="text-brand transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/case-studies/${next.slug}`}
                className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6 text-[14px] text-ink/55 hover:text-ink"
              >
                <span>Next project</span>
                <span className="font-semibold text-ink">{next.title} →</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <CtaBand
          title="Facing a similar"
          accent="challenge?"
          body="Tell us about your organization and objectives — we'll show you how OP DEV would approach it."
        />
      </main>
      <SiteFooter />
    </>
  );
}
