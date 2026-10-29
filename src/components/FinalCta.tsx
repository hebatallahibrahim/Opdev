"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";
import { sceneStore } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The "O" ring returns behind the closing headline.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => (sceneStore.progress = 3 + s.progress),
      });

      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });
      gsap.from("[data-soft]", {
        y: 24,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 45%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-32 text-center md:px-10"
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <p data-soft className="eyebrow mb-8 text-paper/50">
          Start a conversation
        </p>
        <h2 className="t-display font-extrabold">
          <span className="mask">
            <span data-rise>Let&apos;s Build</span>
          </span>
          <span className="mask">
            <span data-rise>
              <span className="accent font-normal">What&apos;s</span> Next<span className="text-brand">.</span>
            </span>
          </span>
        </h2>
        <p data-soft className="mx-auto mt-8 max-w-xl text-[16px] leading-relaxed text-paper/70 md:text-base">
          Whether you&apos;re strengthening your organization, developing new capabilities, or exploring your next
          growth opportunity, OP DEV is ready to help you move forward.
        </p>
        <div data-soft className="mt-10 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <Link
              href="/contact"
              data-cursor="Book"
              className="block rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white"
            >
              Schedule a Consultation
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/contact#request"
              className="block rounded-full border border-paper/25 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-paper"
            >
              Contact Our Team
            </Link>
          </Magnetic>
        </div>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 text-[12px] text-paper/45 md:flex-row">
        <span>© {new Date().getFullYear()} OP DEV. All rights reserved.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-paper">LinkedIn</a>
          <a href="#" className="hover:text-paper">Instagram</a>
          <a href="#" className="hover:text-paper">Behance</a>
        </span>
        <span>Building Capabilities. Enabling Growth.</span>
      </footer>
    </section>
  );
}
