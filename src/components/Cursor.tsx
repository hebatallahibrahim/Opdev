"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      const text = target?.dataset.cursor ?? "";
      label.current!.textContent = text;
      gsap.to(r, {
        scale: target ? (text ? 2.6 : 1.8) : 1,
        backgroundColor: text ? "rgba(255,255,255,0.16)" : target ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
        borderColor: text ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.55)",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(d, { scale: target ? 0 : 1, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div className="cursor pointer-events-none fixed inset-0 z-[70]">
      {/* Only the dot inverts. The ring is frosted glass: transparent with a backdrop blur,
          a white edge and a dark halo, so it reads on light, dark and brand-blue alike. */}
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper mix-blend-difference" />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-white/[0.04] shadow-[0_0_0_1px_rgba(24,24,34,0.22),0_6px_18px_rgba(24,24,34,0.18)] backdrop-blur-[3px] backdrop-saturate-150"
      >
        <span ref={label} className="text-[5px] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_0_3px_rgba(24,24,34,0.7)]" />
      </div>
    </div>
  );
}
