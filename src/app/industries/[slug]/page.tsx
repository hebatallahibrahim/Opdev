import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero, { PillLink } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import WorkVisual from "@/components/WorkVisual";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { categoryById } from "@/content/services";
import { CASE_STUDIES } from "@/content/caseStudies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ind = industryBySlug((await params).slug);
  return ind ? { title: `${ind.name} — OP Dev.`, description: ind.overview } : {};
}

export default async function IndustryPage({ params }: Props) {
  const ind = industryBySlug((await params).slug);
  if (!ind) notFound();

  const services = ind.services.map(categoryById).filter((s) => !!s);
  const cases = CASE_STUDIES.filter((c) => c.industry === ind.slug);
  const index = INDUSTRIES.indexOf(ind);
  const next = INDUSTRIES[(index + 1) % INDUSTRIES.length];

  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.name }]}
          title={ind.name}
          description={ind.overview}
          actions={<PillLink href={`/contact?industry=${ind.slug}`}>Discuss your project</PillLink>}
          visual={
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
              <WorkVisual kind={ind.visual.kind} config={ind.visual.config} label={ind.name} />
            </div>
          }
        />

        {/* Challenges + relevant services */}
        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p data-fade className="eyebrow text-ink/45">
                Common challenges
              </p>
              <h2 className="mt-5 t-h2 font-bold">
                <span className="mask">
                  <span data-rise>What gets in</span>
                </span>
                <span className="mask">
                  <span data-rise className="accent text-brand">
                    the way.
                  </span>
                </span>
              </h2>
              <ol data-stagger className="mt-10">
                {ind.challenges.map((c, i) => (
                  <li key={c} className="flex gap-5 border-t border-ink/10 py-6 text-[17px] font-medium leading-snug md:text-xl">
                    <span className="accent text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {c}
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p data-fade className="eyebrow text-ink/45">
                Relevant OP DEV services
              </p>
              <ul data-stagger className="mt-8 space-y-2">
                {services.map(({ line, category }) => (
                  <li key={category.id}>
                    <Link
                      href={`/services/${line.slug}#${category.id}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-paper-2/60 px-5 py-4 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      <span>
                        <span className="block text-[16px] font-semibold">{category.title}</span>
                        <span className="text-[12px] opacity-50">{line.eyebrow}</span>
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Tailored applications */}
        <Reveal className="relative z-10 bg-paper px-5 pb-20 text-ink md:px-10 md:pb-28">
          <div className="border-t border-ink/10 pt-20 md:pt-28">
            <p data-fade className="eyebrow text-ink/45">
              Tailored applications & solutions
            </p>
            <div
              data-stagger
              className={`mt-10 grid gap-4 md:grid-cols-2 ${ind.applications.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
            >
              {ind.applications.map((a, i) => (
                <article key={a.title} className="flex flex-col rounded-[1.5rem] bg-ink p-7 text-paper">
                  <span className="accent text-3xl text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-10 text-xl font-semibold leading-tight tracking-[-0.02em]">{a.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-paper/70">{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Case studies + outcomes */}
        <Reveal className="relative z-10 bg-paper px-5 pb-20 text-ink md:px-10 md:pb-28">
          <div className="grid gap-14 border-t border-ink/10 pt-20 md:pt-28 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p data-fade className="eyebrow text-ink/45">
                Expected outcomes
              </p>
              <h2 className="mt-5 t-h2 font-bold">
                <span className="mask">
                  <span data-rise>What success</span>
                </span>
                <span className="mask">
                  <span data-rise className="accent text-brand">
                    looks like.
                  </span>
                </span>
              </h2>
              <ul data-stagger className="mt-10 space-y-3">
                {ind.outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-4 text-[17px] font-medium">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[13px] text-white">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p data-fade className="eyebrow text-ink/45">
                Relevant experience
              </p>
              {cases.length > 0 ? (
                <div data-stagger className="mt-8 grid gap-4">
                  {cases.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/case-studies/${c.slug}`}
                      data-cursor="View"
                      className="group grid grid-cols-[8rem_1fr] overflow-hidden rounded-[1.25rem] border border-ink/10 transition-colors hover:border-brand md:grid-cols-[11rem_1fr]"
                    >
                      <div className="aspect-square">
                        <WorkVisual kind={c.visual} label={c.title} />
                      </div>
                      <div className="flex flex-col justify-center p-5">
                        <span className="eyebrow text-[10px] text-brand">{c.service}</span>
                        <span className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em]">{c.title}</span>
                        <span className="mt-2 text-[13px] text-ink/55">{c.outcome}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div data-fade className="mt-8 rounded-[1.25rem] border border-dashed border-ink/20 p-8 text-[16px] leading-relaxed text-ink/70">
                  Sector case studies are being prepared. In the meantime, see{" "}
                  <Link href="/case-studies" className="font-semibold text-brand">
                    all case studies
                  </Link>{" "}
                  or talk to us about your project.
                </div>
              )}
              <Link
                href={`/industries/${next.slug}`}
                className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6 text-[14px] text-ink/55 hover:text-ink"
              >
                <span>Next sector</span>
                <span className="font-semibold text-ink">{next.name} →</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <CtaBand
          eyebrow={ind.name}
          title="Let's discuss"
          accent="your next step."
          body={`Tell us about your organization and goals — we'll shape the right mix of OP DEV capabilities for ${ind.name.toLowerCase()}.`}
          href={`/contact?industry=${ind.slug}`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
