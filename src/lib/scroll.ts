import type Lenis from "lenis";

// The active Lenis instance (null when reduced motion disables smooth scroll).
export const scroller: { lenis: Lenis | null } = { lenis: null };

// Scroll to an element through Lenis when present, so the two never fight.
export function scrollToId(id: string, offset = -96) {
  const el = document.getElementById(id);
  if (!el) return;
  if (scroller.lenis) scroller.lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
