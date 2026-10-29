// Shared drawing kit for the interactive card visuals (components/WorkVisual.tsx
// and components/visuals/*). Brand colours, per-frame state and small helpers.

export const C = {
  ink: "#181822",
  ink2: "#22222e",
  blue: "#007ffd",
  sky: "#94cffd",
  lav: "#9564f5",
  paper: "#f8f8f8",
};

// Optional per-use content, so one visual idea can be told for different sectors.
export type VisualConfig = {
  title?: string;
  hub?: string;
  items?: string[];
  stages?: { name: string; does: string }[];
  quadrants?: { name: string; hint: string }[];
  axes?: [string, string];
  from?: string;
  to?: string;
  prefix?: string;
  counter?: string;
};

export type S = {
  cfg: VisualConfig;
  w: number;
  h: number;
  t: number;
  dt: number;
  px: number; // pointer, 0..1, smoothed
  py: number;
  hover: number; // 0..1, smoothed
  font: string;
  mem: Record<string, unknown>; // per-card state (particles, ripples, cached layouts)
};

export type Ctx = CanvasRenderingContext2D;
export type Draw = (ctx: Ctx, s: S) => void;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

export function background(ctx: Ctx, s: S, glowX = 0.7, glowY = 0.3) {
  const g = ctx.createRadialGradient(s.w * glowX, s.h * glowY, 0, s.w * glowX, s.h * glowY, s.w * 0.9);
  g.addColorStop(0, "#1d2a52");
  g.addColorStop(1, C.ink);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s.w, s.h);
  ctx.strokeStyle = alpha(C.paper, 0.045);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < s.w; x += 24) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, s.h);
  }
  for (let y = 0; y < s.h; y += 24) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(s.w, y + 0.5);
  }
  ctx.stroke();
}

export function label(
  ctx: Ctx,
  s: S,
  str: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 600,
  align: CanvasTextAlign = "left",
  maxWidth?: number
) {
  ctx.font = `${weight} ${size}px ${s.font}`;
  // Shrink to fit when a box is narrower than the text (small cards, phones).
  if (maxWidth) {
    const width = ctx.measureText(str).width;
    if (width > maxWidth) ctx.font = `${weight} ${Math.max(7, (size * maxWidth) / width)}px ${s.font}`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(str, x, y);
}

export function pill(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Small uppercase caption in the top-left corner of a visual.
export function caption(ctx: Ctx, s: S, text: string) {
  label(ctx, s, text, 20, 24, 11, alpha(C.paper, 0.55), 700);
}
