"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import WorkVisual from "./WorkVisual";
import { POSTS as ALL_POSTS } from "@/content/insights";

gsap.registerPlugin(ScrollTrigger);

// The three newest articles (see content/insights.ts).
const POSTS = ALL_POSTS.slice(0, 3);

export default function Insights() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from("[data-post]", {
        y: 70,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-posts]", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    // Last light section: its rounded bottom reveals the dark closing CTA.
    <section
      ref={root}
      id="insights"
      className="relative z-10 rounded-b-[2rem] bg-paper px-5 pb-24 pt-8 text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] md:rounded-b-[3.5rem] md:px-10 md:pb-32"
    >
      <div className="flex flex-col justify-between gap-8 border-t border-ink/10 pt-20 md:flex-row md:items-end md:pt-28">
        <div>
          <p className="eyebrow text-ink/50">Insights & resources</p>
          <h2 className="mt-6 t-h2 font-bold">
            <span className="mask">
              <span data-rise>Thinking for</span>
            </span>
            <span className="mask">
              <span data-rise>
                <span className="accent font-normal text-brand">decision</span>-makers.
              </span>
            </span>
          </h2>
        </div>
        <Link
          href="/insights"
          className="group inline-flex items-center gap-3 self-start rounded-full border border-ink/20 py-3 pl-6 pr-3 text-[13px] font-semibold transition-colors hover:bg-ink hover:text-paper md:self-auto"
        >
          All insights
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
            ↗
          </span>
        </Link>
      </div>

      <div data-posts className="mt-14 grid gap-10 md:grid-cols-3 md:gap-5">
        {POSTS.map((p) => (
          <article key={p.title} data-post className="group">
            <Link href={`/insights/${p.slug}`} data-cursor="Read" className="block">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                <WorkVisual kind={p.visual.kind} config={p.visual.config} label={p.title} />
              </div>
              <div className="mt-5 flex items-center gap-3 text-[11px] text-ink/50">
                <span className="eyebrow text-[10px] text-brand">{p.format}</span>
                <span className="h-1 w-1 rounded-full bg-ink/30" />
                <span>{p.category}</span>
                <span className="ml-auto tabular-nums">{p.minutes} min read</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] md:text-[1.45rem]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out)] group-hover:bg-[length:100%_1px]">
                  {p.title}
                </span>
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
