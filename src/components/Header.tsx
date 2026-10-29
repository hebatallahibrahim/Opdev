"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import Magnetic from "./Magnetic";
import Logo from "./Logo";
import { onIntro } from "@/lib/sceneStore";
import { SERVICE_LINES } from "@/content/services";

const NAV = [
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const [mega, setMega] = useState(false);
  const [menu, setMenu] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  // Highlight pill that glides behind the hovered nav item.
  const [pill, setPill] = useState({ left: 0, width: 0, on: false });
  const movePill = (el: HTMLElement) => setPill({ left: el.offsetLeft, width: el.offsetWidth, on: true });
  const isActive = (href: string) => href !== "/" && pathname.startsWith(href);

  useEffect(() => {
    const el = ref.current!;
    const intro = gsap.from(el.querySelectorAll("[data-intro]"), {
      yPercent: -120,
      opacity: 0,
      duration: 1.1,
      stagger: 0.05,
      ease: "expo.out",
      delay: 0.9,
      paused: true,
    });
    const off = onIntro(() => intro.play());

    // Hide on scroll down, reveal on scroll up.
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > last && y > 200;
      if (hide) setMega(false);
      gsap.to(el, { yPercent: hide ? -130 : 0, duration: 0.6, ease: "power3.out", overwrite: true });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      off();
      intro.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Small delay on close so the pointer can travel from the nav item into the panel.
  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  return (
    <>
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 px-5 pt-5 md:px-10 md:pt-7">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          data-intro
          className="rounded-full border border-paper/10 bg-ink/85 py-1.5 pl-1.5 pr-4 text-paper shadow-lg shadow-black/10 backdrop-blur-xl"
          aria-label="OP Dev. home"
        >
          <Logo />
        </Link>

        <nav
          onPointerLeave={() => setPill((p) => ({ ...p, on: false }))}
          className="relative hidden items-center rounded-full border border-paper/10 bg-ink/85 p-1 shadow-lg shadow-black/10 backdrop-blur-xl lg:flex"
        >
          <span
            aria-hidden
            className={`absolute inset-y-1 rounded-full bg-paper/12 transition-all duration-500 ease-[var(--ease-out)] ${pill.on ? "opacity-100" : "opacity-0"}`}
            style={{ left: pill.left, width: pill.width }}
          />
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                data-intro
                aria-current={active ? "page" : undefined}
                aria-expanded={item.mega ? mega : undefined}
                onPointerEnter={(e) => {
                  movePill(e.currentTarget);
                  if (item.mega) openMega();
                }}
                onPointerLeave={item.mega ? closeMega : undefined}
                onFocus={(e) => {
                  movePill(e.currentTarget);
                  if (item.mega) openMega();
                }}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-300 ${
                  active || (item.mega && mega) ? "text-paper" : "text-paper/70 hover:text-paper"
                }`}
              >
                {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />}
                {item.label}
                {item.mega && (
                  <span aria-hidden className={`text-[10px] transition-transform duration-300 ${mega ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div data-intro className="flex items-center gap-2">
          <Magnetic strength={0.25}>
            <Link
              href="/contact"
              className="group flex items-center gap-3 rounded-full bg-brand py-2.5 pl-5 pr-2.5 text-[13px] font-semibold text-white"
            >
              <span className="hidden sm:inline">Schedule a Consultation</span>
              <span className="sm:hidden">Let&apos;s talk</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                ↗
              </span>
            </Link>
          </Magnetic>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-paper/15 bg-ink/85 text-paper backdrop-blur-xl lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Services mega menu: both business lines and every division, one hover away. */}
      <div
        onPointerEnter={openMega}
        onPointerLeave={closeMega}
        className={`absolute left-1/2 top-full hidden w-[min(980px,calc(100vw-5rem))] -translate-x-1/2 pt-3 transition-all duration-500 ease-[var(--ease-out)] lg:block ${
          mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="grid grid-cols-[1fr_1.3fr_1.3fr] gap-2 rounded-[1.75rem] border border-paper/10 bg-ink/90 p-2 text-paper shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <Link
            href="/services"
            onClick={() => setMega(false)}
            className="group flex flex-col justify-between rounded-[1.4rem] bg-brand p-6 text-white"
          >
            <span className="eyebrow text-white/70">Services</span>
            <span>
              <span className="block text-2xl font-bold leading-tight tracking-[-0.03em]">What can we build together?</span>
              <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold">
                All services
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </span>
          </Link>
          {SERVICE_LINES.map((line) => (
            <div key={line.slug} className="rounded-[1.4rem] bg-paper/[0.04] p-5">
              <Link
                href={`/services/${line.slug}`}
                onClick={() => setMega(false)}
                className="eyebrow text-brand-soft hover:text-paper"
              >
                {line.eyebrow} →
              </Link>
              <ul className="mt-4 space-y-0.5">
                {line.categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/services/${line.slug}#${c.id}`}
                      onClick={() => setMega(false)}
                      className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-paper/75 transition-colors hover:bg-paper/[0.06] hover:text-paper"
                    >
                      {c.title}
                      <span className="text-brand opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </header>
      {/* Mobile / tablet menu — outside <header>, whose transform would trap a fixed overlay. */}
      <div
        className={`fixed inset-0 z-40 bg-ink/95 px-5 pb-10 pt-28 backdrop-blur-2xl transition-all duration-500 ease-[var(--ease-out)] lg:hidden ${
          menu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-between overflow-y-auto">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li
                key={item.label}
                className={`transition-all duration-700 ease-[var(--ease-out)] ${menu ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: menu ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className="flex items-baseline justify-between border-b border-paper/10 py-4 text-4xl font-semibold tracking-[-0.04em] text-paper"
                >
                  {item.label}
                  <span className="text-[12px] tabular-nums text-paper/35">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-2 text-[14px]">
            {SERVICE_LINES.map((line) => (
              <Link key={line.slug} href={`/services/${line.slug}`} onClick={() => setMenu(false)} className="text-brand-soft">
                {line.eyebrow} →
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
