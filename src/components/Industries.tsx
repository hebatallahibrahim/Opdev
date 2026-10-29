"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import WorkVisual from "./WorkVisual";
import { INDUSTRIES } from "@/content/industries";

gsap.registerPlugin(ScrollTrigger);

export default function Industries() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-row]", {
        yPercent: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-list]", start: "top 80%" },
      });
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);

    // Floating preview follows the pointer over the list (desktop only).
    const el = preview.current!;
    if (!window.matchMedia("(hover: hover)").matches) return () => ctx.revert();
    // Sits beside the pointer so it never covers the row being read.
    gsap.set(el, { yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(Math.min(e.clientX + 48, window.innerWidth - 330));
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    gsap.to(preview.current, {
      scale: active === null ? 0.6 : 1,
      opacity: active === null ? 0 : 1,
      rotate: active === null ? -6 : 0,
      duration: 0.5,
      ease: "expo.out",
    });
  }, [active]);

  const current = INDUSTRIES[active ?? 0];

  return (
    <section ref={root} id="industries" className="relative z-10 bg-paper px-2 md:px-4">
      <div className="overflow-clip rounded-[2rem] bg-ink py-20 text-paper md:rounded-[3rem] md:py-28">
        <div className="grid gap-8 px-5 md:grid-cols-12 md:px-12">
          <p className="eyebrow text-paper/50 md:col-span-3">Industries we serve</p>
          <h2 className="t-h2 font-bold md:col-span-6">
            <span className="mask">
              <span data-rise>Built for the way</span>
            </span>
            <span className="mask">
              <span data-rise>
                <span className="accent font-normal text-brand-soft">your sector</span> works.
              </span>
            </span>
          </h2>
          <p className="self-end text-[16px] leading-relaxed text-paper/55 md:col-span-3">
            Eleven sectors, one integrated model — each with the services, systems and stories that sector actually
            needs.
          </p>
        </div>

        <ul data-list className="mt-16 border-t border-paper/10 md:mt-24" onPointerLeave={() => setActive(null)}>
          {INDUSTRIES.map((ind, i) => (
            <li key={ind.name} data-row onPointerEnter={() => setActive(i)}>
              <Link
                href={`/industries/${ind.slug}`}
                data-cursor="View"
                className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-paper/10 px-5 py-5 md:grid-cols-[4rem_1fr_auto_3rem] md:px-12 md:py-7"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100" />
                <span className="relative text-[12px] tabular-nums text-paper/40 transition-colors group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  <span className="block t-row font-semibold transition-[color,transform] duration-500 ease-[var(--ease-out)] group-hover:translate-x-3 group-hover:text-white">
                    {ind.name}
                  </span>
                  <span className="mt-1 block text-[13px] text-paper/50 md:hidden">{ind.line}</span>
                </span>
                <span className="relative hidden gap-2 md:flex">
                  {ind.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-paper/15 px-3 py-1 text-[11px] text-paper/70 transition-colors group-hover:border-white/40 group-hover:text-white"
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <span className="relative grid h-9 w-9 place-items-center justify-self-end rounded-full border border-paper/20 text-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex overflow-hidden md:mt-20" aria-hidden>
          <div className="marquee-track flex shrink-0 animate-[marquee_50s_linear_infinite] items-center whitespace-nowrap">
            {[...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
              <span key={i} className="flex items-center text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                <span className={i % 2 ? "accent font-normal text-paper/40" : ""}>{ind.name}</span>
                <span className="mx-8 inline-block h-3 w-3 rounded-full bg-brand md:mx-12" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[360px] overflow-hidden rounded-2xl bg-ink opacity-0 shadow-2xl shadow-black/40 md:block"
      >
        <div className="aspect-[4/3]">
          {/* Follows the pointer across the list, so the visual reacts as you move. */}
          <WorkVisual key={active ?? 0} kind={current.visual.kind} config={current.visual.config} label={current.name} track="window" />
        </div>
        <p className="p-4 text-[13px] leading-snug text-paper/75">{current.line}</p>
      </div>
    </section>
  );
}
