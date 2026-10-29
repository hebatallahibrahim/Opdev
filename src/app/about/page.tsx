import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero, { PillLink } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import WorkVisual from "@/components/WorkVisual";
import { SERVICE_LINES } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";

export const metadata: Metadata = {
  title: "About — OP Dev.",
  description: "OP DEV's identity, operating model, values and approach to partnership.",
};

// Mission & vision are drafts aligned with the brief's positioning, pending client approval.
// Values follow the "Brand Personality" section of the OP Dev. brand guideline.
const VALUES = [
  { name: "Strategic & Analytical", body: "Decisions grounded in research, data and clear objectives." },
  { name: "Bold & Creative", body: "Ideas that stand out and move audiences to act." },
  { name: "Trusted & Professional", body: "Reliable delivery, transparent communication, no surprises." },
  { name: "Collaborative & Integrated", body: "One team across disciplines, working as an extension of yours." },
  { name: "Dynamic & Modern", body: "Tech-forward methods that keep pace with your market." },
  { name: "Discipline & Excellence", body: "High standards, defined deliverables and measurable KPIs." },
];

const APPROACH = [
  { word: "Build.", body: "Strengthen organizational foundations, brands, processes, and digital infrastructure." },
  { word: "Execute.", body: "Deliver integrated services through specialized teams and flexible outsourcing models." },
  { word: "Grow.", body: "Identify business opportunities, develop strategic partnerships, and support market expansion." },
];

const PROCESS = [
  { step: "Discover", body: "We listen first — your objectives, context, constraints and what success should look like." },
  { step: "Define", body: "Scope, deliverables, team, timeline and KPIs agreed up front, in writing." },
  { step: "Deliver", body: "Specialized teams execute, with regular check-ins and transparent progress reporting." },
  { step: "Measure & grow", body: "We review results against the KPIs and plan the next stage together." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "About OP DEV" }]}
          title="An integrated partner"
          accent="for organizations that move."
          description="OP DEV is an integrated business partner providing organizational development, outsourcing services, digital and software solutions, media production, and strategic business growth support."
          actions={<PillLink href="/contact">Let&apos;s Work Together</PillLink>}
          visual={
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
              <WorkVisual
                kind="bxg"
                label="How OP DEV works: build, execute, grow"
              />
            </div>
          }
        />

        {/* Mission, vision & values */}
        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28">
          <div className="grid gap-5 md:grid-cols-2">
            <div data-fade className="rounded-[1.75rem] bg-ink p-8 text-paper md:p-12">
              <p className="eyebrow text-brand-soft">Mission</p>
              <p className="mt-8 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-[2rem]">
                Help businesses and organizations build strong foundations, execute with specialized teams, and grow sustainably —
                with clear, measurable objectives.
              </p>
            </div>
            <div data-fade className="rounded-[1.75rem] bg-brand p-8 text-white md:p-12">
              <p className="eyebrow text-white/70">Vision</p>
              <p className="mt-8 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-[2rem]">
                To be the trusted, integrated partner organizations turn to when they need to build capabilities and unlock growth.
              </p>
            </div>
          </div>

          <div className="mt-20 md:mt-28">
            <p data-fade className="eyebrow text-ink/45">
              Values
            </p>
            <ul data-stagger className="mt-8 grid gap-px overflow-hidden rounded-[1.5rem] bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((v, i) => (
                <li key={v.name} className="bg-paper p-7">
                  <span className="text-[11px] tabular-nums text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{v.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{v.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Approach + integrated service model */}
        <Reveal className="relative z-10 bg-paper px-5 pb-20 text-ink md:px-10 md:pb-28">
          <div className="border-t border-ink/10 pt-20 md:pt-28">
            <p data-fade className="eyebrow text-ink/45">
              Our approach
            </p>
            <div data-stagger className="mt-10 grid gap-10 md:grid-cols-3">
              {APPROACH.map((a) => (
                <div key={a.word}>
                  <h3 className="t-display font-extrabold">{a.word}</h3>
                  <p className="mt-4 max-w-xs text-[16px] leading-relaxed text-ink/70">{a.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-12 border-t border-ink/10 pt-20 md:mt-28 md:pt-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p data-fade className="eyebrow text-ink/45">
                Integrated service model
              </p>
              <h2 className="mt-5 t-h2 font-bold">
                <span className="mask">
                  <span data-rise>Two lines.</span>
                </span>
                <span className="mask">
                  <span data-rise className="accent text-brand">
                    One partner.
                  </span>
                </span>
              </h2>
              <p data-fade className="mt-6 text-[16px] leading-relaxed text-ink/70">
                Capabilities that usually sit with separate agencies and consultancies — connected under one team and one set of
                objectives.
              </p>
            </div>
            <div data-stagger className="grid gap-4 lg:col-span-8 lg:grid-cols-2">
              {SERVICE_LINES.map((line) => (
                <Link
                  key={line.slug}
                  href={`/services/${line.slug}`}
                  className="group rounded-[1.5rem] border border-ink/10 bg-paper-2/60 p-7 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <span className="eyebrow text-brand">{line.eyebrow}</span>
                  <ul className="mt-6 space-y-2 text-[16px]">
                    {line.categories.map((c) => (
                      <li key={c.id} className="flex items-center gap-3">
                        <span className="h-1 w-1 rounded-full bg-current opacity-50" />
                        {c.title}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-8 inline-block text-[13px] font-semibold">Explore →</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Team, how we work, industries, partnerships */}
        <Reveal className="relative z-10 bg-paper px-5 pb-20 text-ink md:px-10 md:pb-28">
          <div className="grid gap-12 border-t border-ink/10 pt-20 md:pt-28 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p data-fade className="eyebrow text-ink/45">
                Team & expertise
              </p>
              <p data-fade className="mt-6 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-[1.9rem]">
                Specialized teams for every division — strategists, marketers, designers, developers, producers and business
                consultants — working as one.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p data-fade className="eyebrow text-ink/45">
                How we work
              </p>
              <ol data-stagger className="mt-6">
                {PROCESS.map((p, i) => (
                  <li key={p.step} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/10 py-6">
                    <span className="accent text-2xl text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em]">{p.step}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-20 border-t border-ink/10 pt-20 md:mt-28 md:pt-28">
            <p data-fade className="eyebrow text-ink/45">
              Industries & markets served
            </p>
            <ul data-stagger className="mt-8 flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <li key={ind.slug}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="inline-block rounded-full border border-ink/15 px-4 py-2 text-[14px] transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 border-t border-ink/10 pt-20 md:mt-28 md:pt-28">
            <p data-fade className="eyebrow text-ink/45">
              Partnerships & collaborations
            </p>
            <div data-stagger className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-ink/10 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid aspect-[3/2] place-items-center bg-paper text-[12px] text-ink/35">
                  Partner logo
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <CtaBand title="Let's Work" accent="Together." body="Whether you're building, executing or growing, OP DEV is ready to help you move forward." />
      </main>
      <SiteFooter />
    </>
  );
}
