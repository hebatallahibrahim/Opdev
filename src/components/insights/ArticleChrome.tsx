"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

// Thin progress bar under the header showing how far through the article you are.
export function ReadingProgress({ target }: { target: string }) {
  const [progress, setProgress] = useState(0);

  // Driven by ScrollTrigger, which Lenis keeps in sync with smooth scrolling.
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom 60%",
      onUpdate: (s) => setProgress(s.progress),
    });
    return () => st.kill();
  }, [target]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-[3px] bg-transparent">
      <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

// Sticky table of contents that highlights the section being read.
export function ArticleToc({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [headings]);

  return (
    <nav aria-label="In this article">
      <p className="eyebrow text-[11px] text-ink/45">In this article</p>
      <ol className="mt-4 space-y-1 border-l border-ink/10">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(h.id, -110);
              }}
              className={`-ml-px block border-l-2 py-1.5 pl-4 text-[14px] leading-snug transition-colors ${
                active === h.id ? "border-brand font-semibold text-ink" : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
