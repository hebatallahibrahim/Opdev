"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { playIntro, sceneStore } from "@/lib/sceneStore";
import { LogoMark } from "./Logo";

// Holds the page until the 3D scene is warm, then wipes away into the hero intro.
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    let repeat = false;
    try {
      repeat = sessionStorage.getItem("op-intro") === "1";
      sessionStorage.setItem("op-intro", "1");
    } catch {}

    const num = el.querySelector<HTMLElement>("[data-num]")!;
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;
    const count = { v: 0 };
    const render = () => {
      num.textContent = String(Math.round(count.v)).padStart(3, "0");
      bar.style.transform = `scaleX(${count.v / 100})`;
    };

    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out", delay: 0.1 });
      // The arrow slides into the mark along its diagonal — the brand idea in one move.
      gsap.from("svg [data-arrow]", { x: -0.9, y: 0.9, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.35 });
      gsap.from("svg", { scale: 0.8, opacity: 0, duration: 1.2, ease: "expo.out" });

      // exit() runs later from the ticker, outside this context, so its selectors
      // must be scoped explicitly or they would hit matching elements page-wide.
      const q = gsap.utils.selector(el);
      const exit = () => {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(el, { display: "none" });
            },
          })
          .to(count, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: render })
          .to(q("[data-rise]"), { yPercent: -110, duration: 0.7, stagger: 0.05, ease: "expo.in" }, "+=0.1")
          .to(q("[data-soft], svg"), { opacity: 0, duration: 0.4 }, "<")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, "-=0.15")
          .add(playIntro, "<0.3");
      };

      // Count to 90 on a minimum clock, then wait (max 6s) for the scene to be warm.
      gsap.to(count, {
        v: 90,
        duration: repeat ? 0.5 : 1.9,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          const started = performance.now();
          const check = () => {
            if (sceneStore.ready || performance.now() - started > 6000) {
              gsap.ticker.remove(check);
              exit();
            }
          };
          gsap.ticker.add(check);
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-ink px-5 py-6 text-paper md:px-10 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div data-soft className="flex justify-between text-paper/45">
        <span className="eyebrow">OP DEV ©{new Date().getFullYear()}</span>
        <span className="eyebrow hidden sm:inline">Integrated business partner</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
        <LogoMark className="h-[30vw] w-[30vw] md:h-[11vw] md:w-[11vw]" />
        <span className="mask">
          <span data-rise className="accent text-[17vw] font-bold leading-[0.95] tracking-[-0.03em] md:text-[9vw]">
            OP Dev<span className="text-brand">.</span>
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <p data-soft className="max-w-[12rem] text-[13px] leading-snug text-paper/55">
          Building Capabilities.
          <br />
          <span className="accent text-brand-soft">Enabling Growth.</span>
        </p>
        <span className="mask">
          <span data-rise data-num className="block text-[18vw] font-extrabold leading-[0.8] tracking-[-0.06em] tabular-nums md:text-[8vw]">
            000
          </span>
        </span>
      </div>

      <div data-bar className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-brand" />
    </div>
  );
}
