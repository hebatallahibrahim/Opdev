"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    title: "Integrated capabilities under one partner",
    body: "Strategy, marketing, technology, media and events delivered by one accountable team — no hand-offs between disconnected vendors.",
  },
  {
    title: "Strategic thinking, practical execution",
    body: "Every engagement starts with the business question and ends with work that is shipped, launched or delivered on the ground.",
  },
  {
    title: "Flexible engagement models",
    body: "Project-based, retained or fully outsourced divisions — the model adapts to your stage, budget and internal capacity.",
  },
  {
    title: "Tailored to your organization",
    body: "Corporates, startups and NGOs work differently. Solutions are shaped around your structure, audience and operating reality.",
  },
  {
    title: "Clear objectives and measurable KPIs",
    body: "Defined deliverables, agreed success measures and transparent reporting from kickoff to handover.",
  },
  {
    title: "A long-term growth partnership",
    body: "Beyond single projects — a partner focused on operational effectiveness and sustainable growth over time.",
  },
];

export default function WhyOpDev() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = root.current!.querySelector<HTMLElement>("[data-why-count]")!;
      gsap.utils.toArray<HTMLElement>("[data-why]").forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 62%",
          toggleClass: "is-active",
          onToggle: (s) => {
            if (s.isActive) counter.textContent = `0${i + 1}`;
          },
        });
        gsap.fromTo(
          item.querySelector("[data-line]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: item, start: "top 85%", end: "top 55%", scrub: true } }
        );
      });

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

  return (
    <section ref={root} className="relative z-10 bg-paper px-5 py-24 text-ink md:px-10 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="eyebrow text-ink/50">Why OP DEV</p>
            <h2 className="mt-6 t-h2 font-bold">
              <span className="mask">
                <span data-rise>One partner.</span>
              </span>
              <span className="mask">
                <span data-rise className="accent font-normal text-brand">Every capability</span>
              </span>
              <span className="mask">
                <span data-rise>you need.</span>
              </span>
            </h2>
            <div className="mt-10 hidden items-end gap-3 md:flex">
              <span data-why-count className="t-stat font-extrabold tabular-nums">
                01
              </span>
              <span className="pb-2 text-sm text-ink/40">/ 06</span>
            </div>
          </div>
        </div>

        <ol className="md:col-span-7">
          {REASONS.map((r, i) => (
            <li
              key={r.title}
              data-why
              className="group relative grid grid-cols-[3rem_1fr] gap-x-4 py-9 transition-opacity duration-500 md:grid-cols-[5rem_1fr] md:py-12 md:opacity-25 md:[&.is-active]:opacity-100"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-ink/10" />
              <span data-line className="absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <span className="accent pt-1 text-2xl text-brand md:text-3xl">0{i + 1}</span>
              <div>
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-[2.4rem]">{r.title}</h3>
                <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/70">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
