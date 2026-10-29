"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { onIntro } from "@/lib/sceneStore";
import type { ServiceLine } from "@/content/services";
import WorkVisual from "../WorkVisual";
import Magnetic from "../Magnetic";

export default function ServiceHero({ line }: { line: ServiceLine }) {
  const root = useRef<HTMLElement>(null);
  // "A. B." headlines break onto two lines; the second takes the accent.
  const [first, ...rest] = line.title.split(/(?<=\.)\s+/);

  useEffect(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-rise]", { yPercent: 110, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-fade]", { y: 24, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0.3)
        .from("[data-visual]", { scale: 0.92, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.2);
      off = onIntro(() => tl.play());
    }, root);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-clip px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-brand/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-lavender/15 blur-[120px]" />

      <nav data-fade aria-label="Breadcrumb" className="eyebrow relative flex gap-2 text-paper/45">
        <Link href="/" className="hover:text-paper">Home</Link>/<Link href="/services" className="hover:text-paper">Services</Link>/
        <span className="text-brand-soft">{line.eyebrow}</span>
      </nav>

      <div className="relative mt-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1 className="t-h1 font-bold">
            <span className="mask">
              <span data-rise>{first}</span>
            </span>
            {rest.length > 0 && (
              <span className="mask">
                <span data-rise className="accent text-brand-soft">
                  {rest.join(" ")}
                </span>
              </span>
            )}
          </h1>
          <p data-fade className="mt-8 max-w-xl text-[16px] leading-relaxed text-paper/70 md:text-[17px]">
            {line.description}
          </p>
          <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#request"
                className="group inline-flex items-center gap-3 rounded-full bg-brand py-3 pl-6 pr-3 text-[14px] font-semibold text-white"
              >
                {line.cta}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink transition-transform duration-500 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
            <span className="text-[13px] text-paper/45">
              {line.categories.length} service categories · {line.categories.reduce((n, c) => n + c.items.length, 0)} services
            </span>
          </div>
        </div>

        <div data-visual className="mx-auto w-full max-w-[540px] lg:col-span-5 lg:mr-0">
          <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
            <WorkVisual
              kind={line.form === "service" ? "deck" : "growthplan"}
              config={{ items: line.categories.map((c) => c.short) }}
              label={`${line.eyebrow}: ${line.categories.map((c) => c.title).join(", ")}`}
            />
          </div>
          <p data-fade className="mt-3 text-center text-[12px] text-paper/40">
            One partner, every capability connected — hover to explore.
          </p>
        </div>
      </div>
    </section>
  );
}
