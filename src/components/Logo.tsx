import { markPaths } from "@/lib/markShapes";

const PATHS = markPaths();

// The OP Dev. glyph: the "P" plus the blue arrow formed between O and P.
export function LogoMark({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <svg viewBox="-1.02 -1.02 2.04 2.04" className={className} aria-hidden>
      <path d={PATHS.p} fill={tone === "light" ? "#f8f8f8" : "#181822"} />
      <path data-arrow d={PATHS.arrow} fill="#007ffd" />
    </svg>
  );
}

// Glyph + "OP Dev." word mark (horizontal logo).
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="accent text-[21px] font-bold tracking-[-0.02em]">
        OP Dev<span className="text-brand">.</span>
      </span>
    </span>
  );
}
