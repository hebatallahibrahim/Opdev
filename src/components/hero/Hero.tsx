"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphWord from "./MorphWord";
import Magnetic from "../Magnetic";
import { onIntro, sceneStore } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [wordStart, setWordStart] = useState(false);

  useEffect(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      off = onIntro(() => tl.play());
      tl.to(sceneStore, { intro: 1, duration: 2.6, ease: "expo.out" }, 0)
        .fromTo(
          "[data-op]",
          { yPercent: 70, clipPath: "inset(100% -10% -25% -10%)" },
          { yPercent: 0, clipPath: "inset(-25% -10% -25% -10%)", duration: 1.4, stagger: 0.08, ease: "expo.out" },
          0.1
        )
        .add(() => setWordStart(true), 0.75)
        .from(
          "[data-fade]",
          { y: 24, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" },
          1.0
        )
        .from("[data-line]", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.inOut" }, 0.6);

      // Headline drifts and softens as the hero leaves.
      gsap.to("[data-headline]", {
        yPercent: -18,
        opacity: 0.15,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    // On phones the copy stacks at the bottom, leaving the top for the glass ring.
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-8 pt-28 lg:justify-between md:px-10 md:pb-10 md:pt-36">
      <div className="hidden items-start justify-between gap-6 text-paper/70 lg:flex">
        <p data-fade className="eyebrow max-w-[14rem]">
          Integrated business partner
        </p>
        <p data-fade className="eyebrow hidden text-right md:block">
          Build — Execute — Grow
          <br />
          <span className="text-paper/35">Est. for organizations that move</span>
        </p>
      </div>

      <div data-headline className="relative">
        <h1 className="relative font-sans t-hero font-extrabold text-paper">
          <span className="sr-only">OP DEV — </span>
          {/* Revealed with an animated clip-path, so nothing stays cropped afterwards. */}
          <span data-op className="inline-block">O</span>
          <span data-op className="inline-block">P</span>
          <span className="ml-[0.01em] text-[0.86em] font-normal tracking-[-0.03em] select-none">
            <MorphWord start={wordStart} />
          </span>
        </h1>
        <div data-line className="mt-6 h-px w-full bg-paper/15 md:mt-8" />
      </div>

      <div className="mt-7 grid gap-6 md:mt-8 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-5">
          <p data-fade className="text-2xl font-medium leading-tight tracking-[-0.02em] md:text-[2rem]">
            Building Capabilities.{" "}
            <span className="accent text-brand-soft">Enabling Growth.</span>
          </p>
        </div>
        <p data-fade className="text-[16px] leading-relaxed text-paper/70 md:col-span-4 md:col-start-7">
          OP DEV partners with businesses and organizations to strengthen their foundations, deliver integrated
          solutions, develop digital systems, and unlock opportunities for sustainable growth.
        </p>
        <div data-fade className="flex flex-wrap gap-3 md:col-span-3 md:justify-end">
          <Magnetic>
            <Link
              href="/services"
              data-cursor="Explore"
              className="block rounded-full bg-paper px-6 py-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-brand hover:text-white"
            >
              Explore Our Services
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/services/investment-business-growth"
              className="block rounded-full border border-paper/25 px-6 py-3.5 text-[13px] font-semibold text-paper backdrop-blur-sm transition-colors hover:border-paper"
            >
              Investment & Business Growth
            </Link>
          </Magnetic>
        </div>
      </div>

      <div data-fade className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/40 md:flex">
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-out)_infinite] bg-brand" />
        </span>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
