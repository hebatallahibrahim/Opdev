"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll reveals for server-rendered sections. Inside, mark elements with:
//   data-rise — masked line that slides up (wrap in <span className="mask">)
//   data-fade — fades and lifts in
//   data-stagger — its direct children appear one after another
export default function Reveal({
  as: Tag = "section",
  className = "",
  id,
  children,
}: {
  as?: "section" | "div" | "article";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: ref.current, start: "top 78%" };
      gsap.from("[data-rise]", { yPercent: 110, duration: 1.3, stagger: 0.07, ease: "expo.out", scrollTrigger: trigger });
      gsap.from("[data-fade]", { y: 28, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", scrollTrigger: trigger });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={className}>
      {children}
    </Tag>
  );
}
