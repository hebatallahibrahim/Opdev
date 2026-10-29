"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIntro, sceneStore } from "@/lib/sceneStore";
import { scroller } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always start at the top so the intro sequence plays.
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const onPointer = (e: PointerEvent) => {
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Scroll stays locked while the preloader is up.
    const html = document.documentElement;
    if (!sceneStore.introPlayed) html.style.overflow = "hidden";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const off = onIntro(() => {
        html.style.overflow = "";
        ScrollTrigger.refresh();
      });
      return () => {
        off();
        window.removeEventListener("pointermove", onPointer);
      };
    }

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    scroller.lenis = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!sceneStore.introPlayed) lenis.stop();
    const off = onIntro(() => {
      html.style.overflow = "";
      lenis.start();
      // The scrollbar comes back with the unlock, so pinned sections must re-measure.
      ScrollTrigger.refresh();
    });

    return () => {
      off();
      window.removeEventListener("pointermove", onPointer);
      gsap.ticker.remove(tick);
      scroller.lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
