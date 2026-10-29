"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(() => import("./Scene"), { ssr: false });

// Fixed WebGL layer behind the dark sections of the page.
export default function SceneLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.2, ease: "power2.out" });

    // Stop rendering while the light sheet fully covers the viewport.
    const st = ScrollTrigger.create({
      trigger: "#sheet",
      start: "top top",
      end: "bottom bottom",
      // Measured after the pinned chapters above it have added their spacing.
      refreshPriority: -1,
      onToggle: (s) => setActive(!s.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-0">
      <Scene active={active} />
    </div>
  );
}
