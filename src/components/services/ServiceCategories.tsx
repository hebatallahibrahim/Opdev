"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ServiceLine } from "@/content/services";
import { scrollToId } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

// Asks the inquiry form to preselect a category (and optionally one service), then scrolls to it.
export function requestCategory(id: string, item?: string) {
  window.dispatchEvent(new CustomEvent("op:select-category", { detail: { id, item } }));
  scrollToId("request");
}

export default function ServiceCategories({ line }: { line: ServiceLine }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-category]").forEach((el, i) => {
        // Scroll spy for the sticky index.
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (s) => {
            if (s.isActive) setActive(i);
          },
        });
        gsap.from(el.querySelectorAll("[data-rise]"), {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
        gsap.from(el.querySelectorAll("[data-item]"), {
          x: -24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 70%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-20 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Sticky index */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-32">
            <p className="eyebrow text-ink/45">{line.eyebrow}</p>
            <ol className="mt-6 space-y-1">
              {line.categories.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className={`group flex items-center gap-4 rounded-xl px-3 py-2.5 text-[16px] transition-colors ${
                      active === i ? "bg-ink text-paper" : "text-ink/55 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <span className={`text-[11px] tabular-nums ${active === i ? "text-brand-soft" : "text-ink/35"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-700 ease-[var(--ease-out)]"
                style={{ width: `${((active + 1) / line.categories.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8">
          {line.categories.map((c, i) => (
            <article
              key={c.id}
              id={c.id}
              data-category
              className="scroll-mt-28 border-t border-ink/10 py-14 first:border-t-0 first:pt-0 md:py-20"
            >
              <div className="flex items-start gap-5 md:gap-8">
                <span className="accent pt-2 text-3xl text-brand md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <h2 className="t-h3 font-bold">
                    <span className="mask">
                      <span data-rise>{c.title}</span>
                    </span>
                  </h2>
                  <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink/70 md:text-base">{c.intro}</p>
                </div>
              </div>

              <ul className="mt-10 grid gap-x-6 sm:grid-cols-2 md:ml-[4.5rem]">
                {c.items.map((item, k) => (
                  <li key={item} data-item>
                    <button
                      type="button"
                      onClick={() => requestCategory(c.id, item)}
                      data-cursor="Request"
                      className="group flex w-full items-center justify-between gap-4 border-b border-ink/10 py-4 text-left text-[16px] font-medium transition-colors hover:text-brand"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="text-[11px] tabular-nums text-ink/35">{String(k + 1).padStart(2, "0")}</span>
                        {item}
                      </span>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/15 text-[12px] transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        ↗
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 md:ml-[4.5rem]">
                <button
                  type="button"
                  onClick={() => requestCategory(c.id)}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-brand"
                >
                  Request {c.short} services
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-paper/10 transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
