"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { onIntro } from "@/lib/sceneStore";

// Dark hero for inner pages: breadcrumb, two-line headline (second line accented),
// supporting copy, optional actions and an optional visual on the right.
export default function PageHero({
  crumbs,
  title,
  accent,
  description,
  actions,
  visual,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  accent?: string;
  description?: string;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-hero-rise]", { yPercent: 110, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0.3)
        .from("[data-hero-visual]", { scale: 0.92, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.2);
      off = onIntro(() => tl.play());
    }, root);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-clip px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-brand/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-lavender/15 blur-[120px]" />

      <nav data-hero-fade aria-label="Breadcrumb" className="eyebrow relative flex flex-wrap gap-2 text-paper/45">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex gap-2">
            {c.href ? (
              <Link href={c.href} className="hover:text-paper">
                {c.label}
              </Link>
            ) : (
              <span className="text-brand-soft">{c.label}</span>
            )}
            {i < crumbs.length - 1 && "/"}
          </span>
        ))}
      </nav>

      <div className={`relative mt-10 grid gap-12 ${visual ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={visual ? "lg:col-span-7" : "max-w-5xl"}>
          <h1 className={`${title.length + (accent?.length ?? 0) > 44 ? "t-h1-long" : "t-h1"} font-bold`}>
            <span className="mask">
              <span data-hero-rise>{title}</span>
            </span>
            {accent && (
              <span className="mask">
                <span data-hero-rise className="accent text-brand-soft">
                  {accent}
                </span>
              </span>
            )}
          </h1>
          {description && (
            <p data-hero-fade className="mt-8 max-w-xl text-[16px] leading-relaxed text-paper/70 md:text-[17px]">
              {description}
            </p>
          )}
          {actions && (
            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
              {actions}
            </div>
          )}
        </div>
        {visual && (
          <div data-hero-visual className="mx-auto w-full max-w-[540px] lg:col-span-5 lg:mr-0">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}

// Primary pill button used in heroes and CTAs.
export function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full bg-brand py-3 pl-6 pr-3 text-[14px] font-semibold text-white"
    >
      {children}
      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
    </Link>
  );
}
