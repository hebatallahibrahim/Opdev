"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import WorkVisual from "./WorkVisual";
import { CASE_STUDIES } from "@/content/caseStudies";
import { industryBySlug } from "@/content/industries";

gsap.registerPlugin(ScrollTrigger);

// Sample projects (see content/caseStudies.ts) until verified case studies are supplied.
const PROJECTS = CASE_STUDIES;

const FILTERS = ["All", "Web", "Software", "Marketing", "Media", "Events", "Growth"];

export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const shown = PROJECTS.filter((p) => filter === "All" || p.service === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const cards = grid.current!.querySelectorAll("[data-card]");
    gsap.fromTo(cards, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out" });
  }, [filter]);

  return (
    <section ref={root} id="work" className="relative z-10 bg-paper px-5 py-24 text-ink md:px-10 md:py-36">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-ink/50">Selected work & results</p>
          <h2 className="mt-6 t-h2 font-bold">
            <span className="mask">
              <span data-rise>Work that</span>
            </span>
            <span className="mask">
              <span data-rise>
                <span className="accent font-normal text-brand">moves</span> organizations.
              </span>
            </span>
          </h2>
        </div>
        <p className="text-[16px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Every project is told through the challenge, OP DEV&apos;s contribution, and the outcome.
          <span className="mt-2 block text-[12px] text-ink/40">Sample projects shown — to be replaced with verified case studies.</span>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by service">
        {FILTERS.map((f) => {
          const count = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.service === f).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                filter === f ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"
              }`}
            >
              {f}
              <sup className="ml-1 text-[9px] opacity-50">{count}</sup>
            </button>
          );
        })}
      </div>

      <div ref={grid} className="mt-10 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <article key={p.title} data-card className="group">
            <Link href={`/case-studies/${p.slug}`} data-cursor="View" className="block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem]">
                <WorkVisual kind={p.visual} label={p.title} />
                <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink backdrop-blur">
                    {p.service}
                  </span>
                  <span className="rounded-full bg-ink/60 px-3 py-1 text-[11px] text-paper backdrop-blur">{industryBySlug(p.industry)?.name}</span>
                </div>
              </div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-[1.45rem]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out)] group-hover:bg-[length:100%_1px]">
                  {p.title}
                </span>
              </h3>
              <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-[13px] leading-snug">
                {[
                  ["Challenge", p.challenge],
                  ["Our role", p.role],
                  ["Outcome", p.outcome],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <dt className="eyebrow pt-0.5 text-[10px] text-ink/40">{k}</dt>
                    <dd className="text-ink/75">{v}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/case-studies"
          className="group inline-flex items-center gap-3 rounded-full border border-ink/20 py-3 pl-6 pr-3 text-[13px] font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          View all case studies
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
