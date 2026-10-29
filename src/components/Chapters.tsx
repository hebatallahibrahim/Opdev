"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneStore } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    word: "Build.",
    line: "the foundations that last.",
    body: "Organizational structures, brand identities, processes and digital infrastructure — engineered to hold weight and scale with you.",
    tags: ["Business Setup", "Brand & Identity", "Process & Workflow", "Digital Infrastructure"],
  },
  {
    word: "Execute.",
    line: "with specialised teams.",
    body: "Six integrated divisions and flexible outsourcing models that turn plans into delivered work — scoped, owned and measured by clear KPIs.",
    tags: ["Marketing & Comms", "Web & Software", "Media & Production", "Events & Experiences"],
  },
  {
    word: "Grow.",
    line: "into what comes next.",
    body: "Market intelligence, strategic partnerships and expansion planning that turn opportunities into sustainable, measurable growth.",
    tags: ["Market Entry", "Strategic Partnerships", "Investment Readiness", "Growth Strategy"],
  },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// Map pinned progress (0..1) to chapter position (0..2) with holds on each chapter,
// so the 3D object only morphs while the copy is changing.
const toChapter = (t: number) => {
  const h = Math.min(t * 2, 1.9999);
  const k = Math.floor(h);
  return k + smooth(0.3, 0.7, h - k);
};

export default function Chapters() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const counters = gsap.utils.toArray<HTMLElement>("[data-count]");

      panels.forEach((p, i) => {
        if (i === 0) return;
        gsap.set(p.querySelectorAll("[data-rise]"), { yPercent: 110 });
        gsap.set(p.querySelectorAll("[data-soft]"), { opacity: 0, y: 30, filter: "blur(8px)" });
      });
      gsap.set(counters.slice(1), { yPercent: 100 });

      // Scene: hero ring -> Build while the section scrolls into view.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => (sceneStore.progress = s.progress),
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: pin.current,
          scrub: 0.8,
          snap: { snapTo: [0, 0.5, 1], duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: "power2.inOut" },
          onUpdate: (s) => {
            sceneStore.progress = 1 + toChapter(s.progress);
            gsap.set("[data-progress]", { scaleY: s.progress });
          },
        },
      });

      // Two transitions, each occupying the middle of its half so chapters hold.
      [0, 1].forEach((i) => {
        const at = i + 0.3;
        const out = panels[i];
        const inn = panels[i + 1];
        tl.to(out.querySelectorAll("[data-rise]"), { yPercent: -110, stagger: 0.03, duration: 0.25 }, at)
          .to(out.querySelectorAll("[data-soft]"), { opacity: 0, y: -30, filter: "blur(8px)", stagger: 0.02, duration: 0.2 }, at)
          .to(counters[i], { yPercent: -100, duration: 0.3 }, at)
          .to(counters[i + 1], { yPercent: 0, duration: 0.3 }, at)
          .to(inn.querySelectorAll("[data-rise]"), { yPercent: 0, stagger: 0.03, duration: 0.25 }, at + 0.15)
          .to(inn.querySelectorAll("[data-soft]"), { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.02, duration: 0.25 }, at + 0.17);
      });
      tl.to({}, { duration: 0.3 }, 1.7);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="services" className="relative">
      <div ref={pin} className="relative h-[100svh] overflow-hidden px-5 md:px-10">
        {/* rail */}
        <div className="absolute left-5 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-paper/15 md:left-10 md:block">
          <div data-progress className="h-full w-full origin-top scale-y-0 bg-brand" />
        </div>

        <div className="absolute inset-x-5 top-24 flex items-center justify-between md:inset-x-10 md:top-32">
          <p className="eyebrow text-paper/50">How we work</p>
          <p className="eyebrow flex items-center gap-1 text-paper/50">
            <span className="relative inline-block h-[1.2em] w-[1.4em] overflow-hidden">
              {CHAPTERS.map((_, i) => (
                <span key={i} data-count className="absolute inset-0 text-paper">
                  0{i + 1}
                </span>
              ))}
            </span>
            / 03
          </p>
        </div>

        {CHAPTERS.map((c, i) => (
          <div
            key={c.word}
            data-chapter
            className="absolute inset-x-5 bottom-[12svh] md:inset-x-10 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:pl-12"
          >
            <h2 className="t-chapter font-extrabold">
              <span className="mask">
                <span data-rise>{c.word}</span>
              </span>
              <span className="mask text-[0.42em] font-normal leading-[1.05] tracking-[-0.02em] text-paper/80">
                <span data-rise className="accent">
                  {c.line}
                </span>
              </span>
            </h2>
            <p data-soft className="mt-6 max-w-md text-[16px] leading-relaxed text-paper/70 md:mt-8 md:text-base">
              {c.body}
            </p>
            <ul className="mt-6 flex max-w-xl flex-wrap gap-2">
              {c.tags.map((t) => (
                <li
                  key={t}
                  data-soft
                  className="rounded-full border border-paper/15 bg-ink/30 px-3.5 py-1.5 text-[12px] text-paper/80 backdrop-blur-md"
                >
                  {t}
                </li>
              ))}
            </ul>
            {i === 0 && <span className="sr-only">Chapter one of three</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
