import * as THREE from "three";

// The OP Dev. mark, rebuilt from the brand guideline's construction.
// Unit circle (the "O"), y up. One 45° cut line (v = -u + C) separates the
// "P" (above-right) from the blue arrow piece (below-left); the open counter
// and gaps form the arrow of opportunity in negative space.

const C = 0.114; // the 45° cut line: v = -u + C
const COUNTER = { top: 0.37, bottom: -0.33, cx: 0.19, r: 0.35 };
const STEM_X = -0.31; // left edge of the P stem
const ARROW = { top: 0.2, bottom: -0.16, left: -0.86, barRight: -0.47 };

const onCircle = (x: number, sign: 1 | -1) => sign * Math.sqrt(1 - x * x);

export function pShape() {
  // Where the cut line meets the circle, top-left.
  const ax = (C - Math.sqrt(2 - C * C)) / 2;
  const ay = -ax + C;
  const fx = STEM_X;
  const fy = onCircle(fx, -1);

  const s = new THREE.Shape();
  s.moveTo(fx, fy);
  s.absarc(0, 0, 1, Math.atan2(fy, fx), Math.atan2(ay, ax), false);
  s.lineTo(C - COUNTER.top, COUNTER.top);
  s.lineTo(COUNTER.cx, COUNTER.top);
  s.absarc(COUNTER.cx, (COUNTER.top + COUNTER.bottom) / 2, COUNTER.r, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(STEM_X, COUNTER.bottom);
  s.lineTo(fx, fy);
  return s;
}

export function arrowShape() {
  const ky = onCircle(ARROW.barRight, -1);
  const ly = onCircle(ARROW.left, -1);

  const s = new THREE.Shape();
  s.moveTo(ARROW.left, ARROW.top);
  s.lineTo(C - ARROW.top, ARROW.top);
  s.lineTo(C - ARROW.bottom, ARROW.bottom);
  s.lineTo(ARROW.barRight, ARROW.bottom);
  s.lineTo(ARROW.barRight, ky);
  s.absarc(0, 0, 1, Math.atan2(ky, ARROW.barRight), Math.atan2(ly, ARROW.left), true);
  s.lineTo(ARROW.left, ARROW.top);
  return s;
}

// Same mark as an SVG path pair for the 2D logo (viewBox -1 -1 2 2, y flipped).
export function markPaths() {
  const toPath = (shape: THREE.Shape) =>
    shape
      .getPoints(96)
      .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(4)} ${(-p.y).toFixed(4)}`)
      .join("") + "Z";
  return { p: toPath(pShape()), arrow: toPath(arrowShape()) };
}
