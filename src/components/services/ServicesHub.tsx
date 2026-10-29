"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { onIntro } from "@/lib/sceneStore";
import { SERVICE_LINES } from "@/content/services";
import WorkVisual from "../WorkVisual";

// /services — the two business lines, per brief section 4.2.
const LINE_COPY: Record<string, { name: string; body: string; cta: string }> = {
  outsourcing: {
    name: "Outsourcing Services",
    body: "Access the expertise, capabilities, and execution support your organization needs through six integrated service divisions.",
    cta: "Explore Outsourcing Services",
  },
  "investment-business-growth": {
    name: "Investment & Business Consultation",
    body: "Identify opportunities, develop business strategies, build strategic partnerships, and plan your next stage of growth with tailored business development support.",
    cta: "Explore Business Growth",
  },
};

export default function ServicesHub() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-rise]", { yPercent: 110, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-fade]", { y: 24, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0.3)
        .from("[data-line-card]", { y: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: "expo.out" }, 0.4);
      off = onIntro(() => tl.play());
    }, root);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-clip px-5 pb-10 pt-32 md:px-10 md:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-brand/20 blur-[140px]" />

      <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="t-h1 font-bold lg:col-span-8">
          <span className="mask">
            <span data-rise>What Can We</span>
          </span>
          <span className="mask">
            <span data-rise>
              <span className="accent text-brand-soft">Build</span> Together?
            </span>
          </span>
        </h1>
        <p data-fade className="max-w-md text-[16px] leading-relaxed text-paper/70 lg:col-span-4">
          OP DEV provides integrated services to help businesses and organizations strengthen their capabilities, execute
          their plans, develop digital solutions, and unlock growth opportunities.
        </p>
      </div>

      <div className="relative mt-16 grid gap-4 md:mt-24 lg:grid-cols-2">
        {SERVICE_LINES.map((line, i) => {
          const copy = LINE_COPY[line.slug];
          return (
            <Link
              key={line.slug}
              href={`/services/${line.slug}`}
              data-line-card
              data-cursor="Explore"
              className="group relative flex flex-col overflow-clip rounded-[2rem] border border-paper/10 bg-paper/[0.03] transition-colors duration-700 hover:border-brand/60"
            >
              <div className="aspect-[16/9] border-b border-paper/10 lg:aspect-[2/1] 2xl:aspect-[5/2]">
                <WorkVisual
                  kind={i === 0 ? "deck" : "growthplan"}
                  config={{ items: line.categories.map((c) => c.short) }}
                  label={copy.name}
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-10">
                <div className="flex items-baseline gap-4">
                  <span className="accent text-4xl text-brand md:text-5xl">0{i + 1}</span>
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] md:text-[2.6rem]">{copy.name}</h2>
                </div>
                <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-paper/70">{copy.body}</p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {line.categories.map((c) => (
                    <li key={c.id} className="rounded-full border border-paper/15 px-3 py-1.5 text-[12px] text-paper/70">
                      {c.title}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-3 pt-10 text-[14px] font-semibold">
                  {copy.cta}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
