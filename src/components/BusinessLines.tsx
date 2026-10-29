"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  {
    n: "01",
    id: "outsourcing",
    href: "/services/outsourcing",
    title: "Outsourcing Services",
    body: "Build organizational capabilities and deliver specialized services across strategy, marketing, web development, software, media, and events.",
    cta: "Explore Outsourcing Services",
    items: [
      "Foundation Development",
      "Marketing & Communications",
      "Web Development",
      "Software Solutions",
      "Media & Production",
      "Events & Experiential",
    ],
  },
  {
    n: "02",
    id: "growth",
    href: "/services/investment-business-growth",
    title: "Investment & Business Growth",
    body: "Assess opportunities, develop business strategies, build partnerships, enter markets, and plan your next stage of expansion.",
    cta: "Explore Business Growth",
    items: [
      "Market Intelligence",
      "Business Development",
      "Investment Opportunities",
      "Market Entry & Expansion",
      "Strategic Partnerships",
      "Growth Strategy",
    ],
  },
];


export default function BusinessLines() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sheet slides over the dark scene with a subtle scale-in.
      gsap.from(root.current, {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el.querySelectorAll("[data-rise]"), {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative z-10 origin-top rounded-t-[2rem] bg-paper text-ink md:rounded-t-[3.5rem]"
    >
      <div className="px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-36">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-ink/50 md:col-span-3">What OP DEV does</p>
          <h2 data-reveal className="t-h2 font-bold md:col-span-9">
            <span className="mask">
              <span data-rise>Two ways we move</span>
            </span>
            <span className="mask">
              <span data-rise>
                organizations <span className="accent font-normal text-brand">forward.</span>
              </span>
            </span>
          </h2>
        </div>

        <div className="mt-16 space-y-4 md:mt-24">
          {LINES.map((l) => (
            <article
              key={l.n}
              id={l.id}
              data-card
              data-cursor="Explore"
              className="group relative overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper-2/60 p-6 transition-colors duration-700 ease-[var(--ease-out)] hover:bg-ink hover:text-paper md:rounded-[2rem] md:p-12"
            >
              <div className="grid gap-8 md:grid-cols-12 md:items-start">
                <span className="accent text-5xl text-brand md:col-span-2 md:text-7xl">{l.n}</span>
                <div className="md:col-span-6">
                  <h3 className="text-3xl font-bold tracking-[-0.04em] md:text-5xl">{l.title}</h3>
                  <p className="mt-4 max-w-lg text-[16px] leading-relaxed opacity-70">{l.body}</p>
                  <a
                    href={l.href}
                    className="mt-8 inline-flex items-center gap-3 text-[13px] font-semibold"
                  >
                    <span className="border-b border-current pb-0.5">{l.cta}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                      ↗
                    </span>
                  </a>
                </div>
                <ul className="grid grid-cols-1 gap-px text-[14px] md:col-span-4">
                  {l.items.map((it, k) => (
                    <li
                      key={it}
                      className="flex items-center justify-between border-b border-current/10 py-2.5 opacity-80 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1"
                      style={{ transitionDelay: `${k * 35}ms` }}
                    >
                      {it}
                      <span className="text-[11px] opacity-50">0{k + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
