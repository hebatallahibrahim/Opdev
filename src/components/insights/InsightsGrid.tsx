"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import WorkVisual from "../WorkVisual";
import { CATEGORIES, POSTS, type Post } from "@/content/insights";

// /insights list: a featured article, then every post filterable by the nine
// brief categories and by content format.

function Meta({ post, light = false }: { post: Post; light?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] ${light ? "text-paper/55" : "text-ink/50"}`}>
      <span className="eyebrow text-[10px] text-brand">{post.format}</span>
      <span className={`h-1 w-1 rounded-full ${light ? "bg-paper/30" : "bg-ink/30"}`} />
      <span>{post.category}</span>
      <span className="ml-auto tabular-nums">{post.minutes} min read</span>
    </div>
  );
}

export default function InsightsGrid() {
  const grid = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string>("All");
  const [format, setFormat] = useState<string>("All");

  const formats = useMemo(() => [...new Set(POSTS.map((p) => p.format))], []);
  const filtered = POSTS.filter((p) => (category === "All" || p.category === category) && (format === "All" || p.format === format));
  const unfiltered = category === "All" && format === "All";
  const [featured, ...rest] = POSTS;
  const list = unfiltered ? rest : filtered;

  useLayoutEffect(() => {
    const cards = grid.current?.querySelectorAll("[data-card]");
    if (cards?.length) gsap.fromTo(cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "expo.out" });
  }, [category, format]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
      active ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"
    }`;

  return (
    <div>
      {/* Featured article */}
      {unfiltered && (
        <Link
          href={`/insights/${featured.slug}`}
          data-cursor="Read"
          className="group grid overflow-hidden rounded-[2rem] bg-ink text-paper lg:grid-cols-2"
        >
          <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[24rem]">
            <WorkVisual kind={featured.visual.kind} config={featured.visual.config} label={featured.title} />
          </div>
          <div className="flex flex-col p-7 md:p-12">
            <span className="eyebrow text-brand-soft">Featured</span>
            <h2 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.035em] md:text-[2.8rem]">{featured.title}</h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-paper/70">{featured.dek}</p>
            <div className="mt-auto pt-10">
              <Meta post={featured} light />
              <span className="mt-6 inline-flex items-center gap-3 text-[14px] font-semibold">
                Read the guide
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">↗</span>
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Filters */}
      <div className={`${unfiltered ? "mt-16 md:mt-24" : ""} space-y-4`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <span className="eyebrow w-24 shrink-0 pt-2 text-[11px] text-ink/45">Topic</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
            {["All", ...CATEGORIES].map((c) => {
              const n = c === "All" ? POSTS.length : POSTS.filter((p) => p.category === c).length;
              return (
                <button key={c} type="button" role="radio" aria-checked={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>
                  {c}
                  <sup className="ml-1 text-[9px] opacity-50">{n}</sup>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <span className="eyebrow w-24 shrink-0 pt-2 text-[11px] text-ink/45">Format</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Format">
            {["All", ...formats].map((f) => (
              <button key={f} type="button" role="radio" aria-checked={format === f} onClick={() => setFormat(f)} className={chip(format === f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={grid} className="mt-12 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <article key={p.slug} data-card className="group">
            <Link href={`/insights/${p.slug}`} data-cursor="Read" className="block">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                <WorkVisual kind={p.visual.kind} config={p.visual.config} label={p.title} />
              </div>
              <div className="mt-5">
                <Meta post={p} />
              </div>
              <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] md:text-[1.4rem]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out)] group-hover:bg-[length:100%_1px]">
                  {p.title}
                </span>
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{p.dek}</p>
            </Link>
          </article>
        ))}
        {list.length === 0 && (
          <p className="text-[16px] text-ink/55 md:col-span-2 lg:col-span-3">No articles in this combination yet — try another topic or format.</p>
        )}
      </div>
    </div>
  );
}
