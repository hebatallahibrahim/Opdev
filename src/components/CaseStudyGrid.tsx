"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import WorkVisual from "./WorkVisual";
import { CASE_STUDIES, SAMPLE_NOTICE } from "@/content/caseStudies";
import { INDUSTRIES } from "@/content/industries";

// Filterable portfolio (brief 4.5): by industry, service category and project type.
const unique = (xs: string[]) => [...new Set(xs)];

function FilterRow({
  label,
  options,
  value,
  onChange,
  format = (v: string) => v,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  format?: (v: string) => string;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <span className="eyebrow w-28 shrink-0 text-[11px] text-ink/45">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {["All", ...options].map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
              value === o ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"
            }`}
          >
            {o === "All" ? "All" : format(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyGrid() {
  const grid = useRef<HTMLDivElement>(null);
  const [industry, setIndustry] = useState("All");
  const [service, setService] = useState("All");
  const [type, setType] = useState("All");

  const industryName = (slug: string) => INDUSTRIES.find((i) => i.slug === slug)?.name ?? slug;
  const shown = useMemo(
    () =>
      CASE_STUDIES.filter(
        (c) =>
          (industry === "All" || c.industry === industry) &&
          (service === "All" || c.service === service) &&
          (type === "All" || c.projectType === type)
      ),
    [industry, service, type]
  );

  useLayoutEffect(() => {
    const cards = grid.current?.querySelectorAll("[data-card]");
    if (cards?.length) gsap.fromTo(cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "expo.out" });
  }, [shown]);

  return (
    <div>
      <div className="space-y-4 rounded-[1.5rem] border border-ink/10 bg-paper-2/50 p-5 md:p-7">
        <FilterRow label="Industry" options={unique(CASE_STUDIES.map((c) => c.industry))} value={industry} onChange={setIndustry} format={industryName} />
        <FilterRow label="Service" options={unique(CASE_STUDIES.map((c) => c.service))} value={service} onChange={setService} />
        <FilterRow label="Project type" options={unique(CASE_STUDIES.map((c) => c.projectType))} value={type} onChange={setType} />
      </div>
      <p className="mt-4 text-[12px] text-ink/40">{SAMPLE_NOTICE}</p>

      <div ref={grid} className="mt-10 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <article key={c.slug} data-card className="group">
            <Link href={`/case-studies/${c.slug}`} data-cursor="View" className="block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                <WorkVisual kind={c.visual} label={c.title} />
                <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink">{c.service}</span>
                  <span className="rounded-full bg-ink/60 px-3 py-1 text-[11px] text-paper backdrop-blur">{c.projectType}</span>
                </div>
              </div>
              <p className="mt-5 text-[12px] text-ink/45">{industryName(c.industry)}</p>
              <h3 className="mt-1 text-xl font-semibold leading-snug tracking-[-0.02em] md:text-2xl">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out)] group-hover:bg-[length:100%_1px]">
                  {c.title}
                </span>
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{c.outcome}</p>
            </Link>
          </article>
        ))}
        {shown.length === 0 && (
          <p className="text-[16px] text-ink/55 md:col-span-2 lg:col-span-3">No projects match these filters yet.</p>
        )}
      </div>
    </div>
  );
}
