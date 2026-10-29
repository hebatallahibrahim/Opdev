"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Suffixes that complete the fixed "OP": OPtimized, OPerate, OPportunity, OPen, OPerational.
export const SUFFIXES = ["timized", "erate", "portunity", "en", "erational"];

const HOLD = 2.4;

export default function MorphWord({ start }: { start: boolean }) {
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const reduced = useRef(false);

  // Animate the current word in, then schedule its exit.
  useLayoutEffect(() => {
    if (!start) return;
    const el = wrap.current!;
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    measure.current!.textContent = SUFFIXES[index];
    const width = measure.current!.getBoundingClientRect().width;
    gsap.to(el, { width, duration: 0.9, ease: "expo.inOut" });

    gsap.fromTo(
      chars,
      { yPercent: 60, rotateX: -90, opacity: 0, filter: "blur(14px)" },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.035,
        ease: "expo.out",
      }
    );
    // The full stop lands once the word has settled.
    gsap.fromTo(
      dot.current,
      { scale: 0 },
      { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.45)", delay: 0.55 + chars.length * 0.035 }
    );

    if (reduced.current) return;
    timer.current = gsap.delayedCall(HOLD, () => {
      gsap.to(dot.current, { scale: 0, duration: 0.3, ease: "power3.in" });
      gsap.to(chars, {
        yPercent: -60,
        rotateX: 90,
        opacity: 0,
        filter: "blur(14px)",
        duration: 0.55,
        stagger: 0.025,
        ease: "power3.in",
        onComplete: () => setIndex((i) => (i + 1) % SUFFIXES.length),
      });
    });
    return () => {
      timer.current?.kill();
    };
  }, [index, start]);

  useEffect(() => {
    // Keep width correct when the viewport changes size.
    const onResize = () => {
      measure.current!.textContent = SUFFIXES[index];
      gsap.set(wrap.current, { width: measure.current!.getBoundingClientRect().width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  return (
    <>
      <span
        ref={wrap}
        className="accent relative inline-block whitespace-nowrap align-baseline [perspective:600px]"
        aria-live="polite"
        style={{ width: 0 }}
      >
        <span className="sr-only">OP{SUFFIXES[index]}</span>
        <span aria-hidden className="inline-block pr-[0.06em]">
          {SUFFIXES[index].split("").map((c, i) => (
            <span
              key={`${index}-${i}`}
              data-char
              // Vertical padding keeps descenders (p, y) inside the gradient-clipped box.
              className="grad-text -my-[0.18em] inline-block origin-[50%_80%] py-[0.18em] opacity-0 will-change-transform"
            >
              {c}
            </span>
          ))}
        </span>
      </span>
      <span
        ref={dot}
        aria-hidden
        className="ml-[0.04em] inline-block h-[0.15em] w-[0.15em] scale-0 rounded-full bg-brand align-baseline"
      />
      <span
        ref={measure}
        aria-hidden
        className="accent pointer-events-none invisible absolute left-0 top-0 select-none whitespace-nowrap pr-[0.06em]"
      />
    </>
  );
}
