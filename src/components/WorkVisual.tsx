"use client";

import { useEffect, useRef } from "react";
import { C, alpha, background, clamp, label, mix, pill, type Ctx, type S, type VisualConfig } from "@/lib/canvasKit";
import { EXTRA, type ExtraKind } from "./visuals/extra";

// Interactive concept visuals for the Selected Work and Insights cards. Each one
// illustrates the idea of its project or article and responds to the pointer. Drawn on a 2D canvas and
// only animated while on screen.

export type WorkKind = "giving" | "erp" | "reach" | "market" | "event" | "story" | "decide" | "crm" | "checklist" | ExtraKind;

export type { VisualConfig } from "@/lib/canvasKit";

/* ---------- 1. Online giving: the goal fills as you engage ---------- */

type Particle = { x: number; y: number; vx: number; vy: number; life: number };

function giving(ctx: Ctx, s: S) {
  background(ctx, s, 0.5, 0.4);
  const { w, h, t } = s;
  const bw = w * 0.66;
  const bh = h * 0.64;
  const bx = (w - bw) / 2 + (s.px - 0.5) * 14;
  const by = (h - bh) / 2 + (s.py - 0.5) * 10;

  // browser window
  pill(ctx, bx, by, bw, bh, 16);
  ctx.fillStyle = alpha(C.paper, 0.06);
  ctx.fill();
  ctx.strokeStyle = alpha(C.paper, 0.16);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(bx + 18 + i * 12, by + 17, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = alpha(C.paper, 0.22);
    ctx.fill();
  }
  label(ctx, s, "Give monthly. Change a year.", bx + 22, by + 50, Math.max(13, w * 0.03), C.paper, 700);
  pill(ctx, bx + 22, by + 70, bw * 0.42, 7, 4);
  ctx.fillStyle = alpha(C.paper, 0.14);
  ctx.fill();

  // progress toward the goal
  const fill = clamp(0.34 + 0.52 * s.hover + 0.015 * Math.sin(t * 2.2));
  const px = bx + 22;
  const py = by + bh * 0.56;
  const pw = bw - 44;
  pill(ctx, px, py, pw, 12, 6);
  ctx.fillStyle = alpha(C.paper, 0.1);
  ctx.fill();
  const g = ctx.createLinearGradient(px, 0, px + pw, 0);
  g.addColorStop(0, C.sky);
  g.addColorStop(1, C.blue);
  pill(ctx, px, py, Math.max(12, pw * fill), 12, 6);
  ctx.fillStyle = g;
  ctx.fill();
  label(ctx, s, `${Math.round(fill * 100)}% of goal`, px, py - 14, 12, alpha(C.paper, 0.75), 600);

  // donate button, pulled toward the pointer
  const bW = 118;
  const bH = 38;
  const btnX = px + (s.px - 0.5) * 10 * s.hover;
  const btnY = by + bh - bH - 22 + (s.py - 0.5) * 8 * s.hover;
  pill(ctx, btnX, btnY, bW, bH, 19);
  ctx.fillStyle = C.blue;
  ctx.fill();
  label(ctx, s, "Donate  ♥", btnX + bW / 2, btnY + bH / 2 + 1, 13, "#fff", 700, "center");

  // gifts rise from the button into the bar
  const parts = (s.mem.parts ??= []) as Particle[];
  if (s.hover > 0.3 && Math.random() < 0.45) {
    parts.push({ x: btnX + bW / 2, y: btnY, vx: (Math.random() - 0.3) * 40, vy: -60 - Math.random() * 60, life: 1 });
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.x += p.vx * s.dt;
    p.y += p.vy * s.dt;
    p.life -= s.dt * 0.9;
    if (p.life <= 0) {
      parts.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * p.life + 1, 0, Math.PI * 2);
    ctx.fillStyle = alpha(i % 2 ? C.sky : C.blue, p.life);
    ctx.fill();
  }
}

/* ---------- 2. ERP: one system, data flowing between modules ---------- */

const MODULES = ["Finance", "Inventory", "Production", "HR", "Sales", "BI"];

function erp(ctx: Ctx, s: S) {
  background(ctx, s, 0.5, 0.5);
  const { w, h, t } = s;
  // Centre sits a little low so the top module clears the card tags.
  const r = Math.min(w, h) * 0.3;
  const oy = h * 0.57;
  const cx = w / 2 + (s.px - 0.5) * 16 * s.hover;
  const cy = oy + (s.py - 0.5) * 12 * s.hover;
  const mx = s.px * w;
  const my = s.py * h;
  const mods = s.cfg.items ?? MODULES;
  if ((s.mem.glow as number[] | undefined)?.length !== mods.length) s.mem.glow = mods.map(() => 0);
  const glow = s.mem.glow as number[];

  const nodes = mods.map((name, i) => {
    const a = (i / mods.length) * Math.PI * 2 - Math.PI / 2;
    return { name, x: w / 2 + Math.cos(a) * r * 1.3, y: oy + Math.sin(a) * r };
  });
  // the module nearest the pointer lights up
  let near = -1;
  let best = Infinity;
  nodes.forEach((n, i) => {
    const d = Math.hypot(n.x - mx, n.y - my);
    if (d < best) {
      best = d;
      near = i;
    }
  });
  nodes.forEach((_, i) => {
    const target = s.hover > 0.2 && i === near ? 1 : 0;
    glow[i] += (target - glow[i]) * (1 - Math.exp(-s.dt * 8));
  });

  nodes.forEach((n, i) => {
    ctx.strokeStyle = alpha(C.sky, 0.18 + glow[i] * 0.6);
    ctx.lineWidth = 1 + glow[i];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(n.x, n.y);
    ctx.stroke();
    // data pulses, faster on the active link
    const speed = 0.35 + glow[i] * 0.9;
    for (let j = 0; j < 2; j++) {
      let f = (t * speed + j / 2 + i * 0.13) % 1;
      if (i % 2) f = 1 - f;
      ctx.beginPath();
      ctx.arc(mix(cx, n.x, f), mix(cy, n.y, f), 2.4 + glow[i] * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = alpha(glow[i] > 0.5 ? "#ffffff" : C.sky, 0.9);
      ctx.fill();
    }
  });

  nodes.forEach((n, i) => {
    const pw = 92;
    const ph = 30;
    pill(ctx, n.x - pw / 2, n.y - ph / 2, pw, ph, 15);
    ctx.fillStyle = glow[i] > 0.05 ? alpha(C.blue, 0.25 + glow[i] * 0.75) : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, 0.15 + glow[i] * 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
    label(ctx, s, n.name, n.x, n.y + 1, 12, glow[i] > 0.5 ? "#fff" : alpha(C.paper, 0.75), 600, "center");
  });

  const hub = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34);
  hub.addColorStop(0, C.sky);
  hub.addColorStop(1, C.blue);
  ctx.beginPath();
  ctx.arc(cx, cy, 30 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = hub;
  ctx.fill();
  label(ctx, s, s.cfg.hub ?? "ERP", cx, cy + 1, 14, "#fff", 700, "center");
}

/* ---------- 3. Awareness: reach spreads outward from where you point ---------- */

type Ripple = { x: number; y: number; age: number };

function reach(ctx: Ctx, s: S) {
  background(ctx, s, 0.3, 0.7);
  const { w, h } = s;
  const ripples = (s.mem.ripples ??= []) as Ripple[];
  s.mem.clock = ((s.mem.clock as number) ?? 0) + s.dt;
  if ((s.mem.clock as number) > (s.hover > 0.3 ? 0.7 : 1.4)) {
    s.mem.clock = 0;
    const x = s.hover > 0.3 ? s.px * w : w * (0.5 + Math.sin(s.t * 0.7) * 0.15);
    const y = s.hover > 0.3 ? s.py * h : h * 0.55;
    ripples.push({ x, y, age: 0 });
    if (ripples.length > 5) ripples.shift();
  }
  ripples.forEach((r) => (r.age += s.dt));

  const step = 17;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      let k = 0;
      for (const r of ripples) {
        const d = Math.hypot(x - r.x, y - r.y);
        const front = r.age * 190;
        const fade = clamp(1 - r.age / 2.4);
        k += Math.exp(-((d - front) ** 2) / 300) * fade;
      }
      k = clamp(k);
      ctx.beginPath();
      ctx.arc(x, y, 1.1 + k * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = k > 0.05 ? alpha(k > 0.6 ? C.paper : C.sky, 0.25 + k * 0.75) : alpha(C.paper, 0.14);
      ctx.fill();
    }
  }
  ripples.forEach((r) => {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.age * 190, 0, Math.PI * 2);
    ctx.strokeStyle = alpha(C.blue, clamp(0.5 - r.age / 4.8));
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  const src = ripples[ripples.length - 1];
  if (src) {
    ctx.beginPath();
    ctx.arc(src.x, src.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = C.blue;
    ctx.fill();
  }
  label(ctx, s, s.cfg.title ?? "CAMPAIGN REACH", 22, 26, 11, alpha(C.paper, 0.55), 700);
}

/* ---------- 4. Market entry: a route from home to the market you point at ---------- */

function market(ctx: Ctx, s: S) {
  background(ctx, s, 0.75, 0.3);
  const { w, h, t } = s;
  // land masses as dot clusters (cached per size)
  const key = `${Math.round(w)}x${Math.round(h)}`;
  if (s.mem.key !== key) {
    const dots: [number, number][] = [];
    for (let y = 10; y < h; y += 13) {
      for (let x = 10; x < w; x += 13) {
        const u = x / w;
        const v = y / h;
        const n = Math.sin(u * 7.1 + 1.3) * Math.cos(v * 5.3 - 0.4) + Math.sin(u * 13 + v * 9) * 0.45;
        if (n > 0.18) dots.push([x, y]);
      }
    }
    s.mem.dots = dots;
    s.mem.key = key;
  }
  const dots = s.mem.dots as [number, number][];
  const ox = w * 0.2;
  const oy = h * 0.7;
  const tx = mix(w * (0.74 + Math.sin(t * 0.4) * 0.04), s.px * w, s.hover);
  const ty = mix(h * (0.3 + Math.cos(t * 0.5) * 0.04), s.py * h, s.hover);

  for (const [x, y] of dots) {
    const d = Math.hypot(x - tx, y - ty);
    const k = clamp(1 - d / 70);
    ctx.beginPath();
    ctx.arc(x, y, 1.4 + k * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = k > 0 ? alpha(C.blue, 0.35 + k * 0.65) : alpha(C.paper, 0.16);
    ctx.fill();
  }

  // the route
  const mxp = (ox + tx) / 2;
  const myp = Math.min(oy, ty) - Math.hypot(tx - ox, ty - oy) * 0.35;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = -t * 30;
  ctx.strokeStyle = C.sky;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(mxp, myp, tx, ty);
  ctx.stroke();
  ctx.setLineDash([]);
  // arrowhead along the curve's final tangent
  const ang = Math.atan2(ty - myp, tx - mxp);
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - Math.cos(ang - 0.45) * 12, ty - Math.sin(ang - 0.45) * 12);
  ctx.lineTo(tx - Math.cos(ang + 0.45) * 12, ty - Math.sin(ang + 0.45) * 12);
  ctx.closePath();
  ctx.fillStyle = C.sky;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ox, oy, 6, 0, Math.PI * 2);
  ctx.fillStyle = C.paper;
  ctx.fill();
  label(ctx, s, s.cfg.from ?? "Home market", ox, oy + 20, 12, alpha(C.paper, 0.7), 600, "center");
  ctx.beginPath();
  ctx.arc(tx, ty, 10 + (Math.sin(t * 3) + 1) * 5, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(C.blue, 0.8);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  label(ctx, s, s.cfg.to ?? "New market", tx, ty - 26, 12, "#fff", 700, "center");
}

/* ---------- 5. Event: a spotlight you steer across stage and crowd ---------- */

function stage(ctx: Ctx, s: S) {
  background(ctx, s, 0.5, 0.15);
  const { w, h, t } = s;
  const aim = mix(0.5 + Math.sin(t * 0.6) * 0.25, s.px, s.hover);
  const lx = w * 0.5;
  const fx = aim * w;
  const floor = h * 0.86;
  const spread = w * 0.16;

  // stage + screen
  const sw = w * 0.56;
  const sx = (w - sw) / 2;
  const sy = h * 0.2;
  pill(ctx, sx, sy, sw, h * 0.26, 10);
  const scr = ctx.createLinearGradient(sx, sy, sx + sw, sy);
  scr.addColorStop(0, "#0b3a8c");
  scr.addColorStop(1, C.blue);
  ctx.fillStyle = scr;
  ctx.fill();
  label(ctx, s, s.cfg.title ?? "ANNUAL SUMMIT", w / 2, sy + h * 0.13, Math.max(14, w * 0.032), "#fff", 700, "center");
  pill(ctx, sx - 16, sy + h * 0.28, sw + 32, 8, 4);
  ctx.fillStyle = alpha(C.paper, 0.2);
  ctx.fill();

  // spotlight cone
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const cone = ctx.createLinearGradient(0, 0, 0, floor);
  cone.addColorStop(0, alpha(C.paper, 0.35));
  cone.addColorStop(1, alpha(C.sky, 0.04));
  ctx.beginPath();
  ctx.moveTo(lx - 6, 0);
  ctx.lineTo(lx + 6, 0);
  ctx.lineTo(fx + spread, floor);
  ctx.lineTo(fx - spread, floor);
  ctx.closePath();
  ctx.fillStyle = cone;
  ctx.fill();
  ctx.restore();

  // crowd rows, lit where the cone lands
  for (let row = 0; row < 5; row++) {
    const y = h * 0.62 + row * h * 0.07;
    const gap = 14 + row * 3;
    for (let x = gap / 2 + (row % 2) * (gap / 2); x < w; x += gap) {
      const coneHalf = mix(6, spread, y / floor);
      const coneX = mix(lx, fx, y / floor);
      const k = clamp(1 - Math.abs(x - coneX) / coneHalf);
      const bob = k * Math.sin(t * 6 + x) * 2;
      ctx.beginPath();
      ctx.arc(x, y - bob, 2.6 + row * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = k > 0 ? alpha(C.paper, 0.35 + k * 0.65) : alpha(C.paper, 0.13);
      ctx.fill();
    }
  }

  // live badge
  pill(ctx, 20, 18, 64, 24, 12);
  ctx.fillStyle = alpha(C.ink, 0.7);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(34, 30, 4, 0, Math.PI * 2);
  ctx.fillStyle = alpha(C.blue, 0.6 + 0.4 * Math.sin(t * 5));
  ctx.fill();
  label(ctx, s, "LIVE", 44, 31, 11, "#fff", 700);
}

/* ---------- 6. Documentary: scrub the story by moving across it ---------- */

const SCENES = [
  ["#0b3a8c", "#94cffd"],
  ["#2b1a5e", "#9564f5"],
  ["#123c5a", "#7fd1c7"],
  ["#3a2a12", "#f2c06b"],
  ["#0e2a4f", "#007ffd"],
  ["#2a1830", "#d89ac8"],
];

function story(ctx: Ctx, s: S) {
  background(ctx, s, 0.5, 0.3);
  const { w, h, t } = s;
  const auto = (t * 0.04) % 1;
  const scrub = clamp(mix(auto, s.px, s.hover), 0, 0.9999);
  const idx = Math.floor(scrub * SCENES.length);
  const [a, b] = SCENES[idx];

  // main frame: a simple scene with a slow push-in
  const fw = w * 0.84;
  const fh = h * 0.52;
  const fx = (w - fw) / 2;
  const fy = h * 0.08;
  ctx.save();
  pill(ctx, fx, fy, fw, fh, 12);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, fy, 0, fy + fh);
  sky.addColorStop(0, a);
  sky.addColorStop(1, b);
  ctx.fillStyle = sky;
  ctx.fillRect(fx, fy, fw, fh);
  const zoom = 1 + ((t * 0.05) % 0.2);
  const sunX = fx + fw * (0.3 + idx * 0.08);
  ctx.beginPath();
  ctx.arc(sunX, fy + fh * 0.45, fh * 0.16 * zoom, 0, Math.PI * 2);
  ctx.fillStyle = alpha(C.paper, 0.85);
  ctx.fill();
  ctx.fillStyle = alpha(C.ink, 0.55);
  ctx.beginPath();
  ctx.moveTo(fx, fy + fh);
  for (let x = 0; x <= fw; x += 8) {
    ctx.lineTo(fx + x, fy + fh * 0.72 + Math.sin(x * 0.02 + idx) * fh * 0.06);
  }
  ctx.lineTo(fx + fw, fy + fh);
  ctx.fill();
  ctx.restore();
  // play / timecode
  const secs = Math.floor(scrub * 420);
  const tc = `00:${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}:${String(Math.floor((t * 24) % 24)).padStart(2, "0")}`;
  label(ctx, s, tc, fx + 14, fy + fh - 16, 11, "#fff", 700);
  label(ctx, s, `SCENE ${String(idx + 1).padStart(2, "0")}`, fx + fw - 14, fy + 18, 11, "#fff", 700, "right");

  // film strip, scrolled by the pointer
  const sy = h * 0.68;
  const sh = h * 0.22;
  ctx.fillStyle = "#0f0f16";
  ctx.fillRect(0, sy, w, sh);
  const tw = sh * 1.25;
  const total = SCENES.length * (tw + 8);
  const offset = w / 2 - scrub * total;
  for (let k = -1; k <= SCENES.length; k++) {
    const i = ((k % SCENES.length) + SCENES.length) % SCENES.length;
    const x = offset + k * (tw + 8);
    const g = ctx.createLinearGradient(0, sy, 0, sy + sh);
    g.addColorStop(0, SCENES[i][0]);
    g.addColorStop(1, SCENES[i][1]);
    pill(ctx, x, sy + sh * 0.18, tw, sh * 0.64, 4);
    ctx.fillStyle = g;
    ctx.globalAlpha = i === idx ? 1 : 0.45;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  for (let x = 6; x < w; x += 16) {
    ctx.fillStyle = alpha(C.paper, 0.25);
    ctx.fillRect(x, sy + 4, 7, 5);
    ctx.fillRect(x, sy + sh - 9, 7, 5);
  }
  // playhead
  ctx.fillStyle = C.blue;
  ctx.fillRect(w / 2 - 1, sy - 6, 2, sh + 12);
  ctx.beginPath();
  ctx.arc(w / 2, sy - 6, 4, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- Insight: outsource or build? A decision matrix you steer ---------- */

const QUADRANTS = [
  { name: "Partner", hint: "Critical, but no in-house depth yet" },
  { name: "Build in-house", hint: "Critical and already a strength" },
  { name: "Outsource", hint: "Not core, no capability to justify" },
  { name: "Hybrid", hint: "Capable, but not where focus pays" },
];

function decide(ctx: Ctx, s: S) {
  background(ctx, s, 0.6, 0.3);
  const { w, h, t } = s;
  const x0 = 46;
  const y0 = 26;
  const gw = w - x0 - 22;
  const gh = h - y0 - 44;
  // idle: the point drifts through the matrix; hover: it follows the pointer
  const dx = mix(0.5 + Math.cos(t * 0.5) * 0.3, clamp((s.px * w - x0) / gw), s.hover);
  const dy = mix(0.5 + Math.sin(t * 0.7) * 0.3, clamp((s.py * h - y0) / gh), s.hover);
  const q = (dy < 0.5 ? 0 : 2) + (dx < 0.5 ? 0 : 1);

  (s.cfg.quadrants ?? QUADRANTS).forEach((quad, i) => {
    const qx = x0 + (i % 2) * (gw / 2);
    const qy = y0 + Math.floor(i / 2) * (gh / 2);
    pill(ctx, qx + 3, qy + 3, gw / 2 - 6, gh / 2 - 6, 10);
    ctx.fillStyle = i === q ? alpha(C.blue, 0.28) : alpha(C.paper, 0.035);
    ctx.fill();
    ctx.strokeStyle = i === q ? alpha(C.blue, 0.9) : alpha(C.paper, 0.1);
    ctx.lineWidth = 1;
    ctx.stroke();
    // Text sizes follow the quadrant width so small cards never clip.
    const qw = gw / 2 - 30;
    label(ctx, s, quad.name, qx + 14, qy + 22, clamp(qw / 8, 10, 15), i === q ? "#fff" : alpha(C.paper, 0.4), 700);
    if (i === q && qw > 150) label(ctx, s, quad.hint, qx + 14, qy + 42, 10.5, alpha(C.paper, 0.75), 500);
  });

  // axes
  label(ctx, s, s.cfg.axes?.[0] ?? "IN-HOUSE CAPABILITY →", x0 + gw / 2, h - 16, 10, alpha(C.paper, 0.5), 700, "center");
  ctx.save();
  ctx.translate(20, y0 + gh / 2);
  ctx.rotate(-Math.PI / 2);
  label(ctx, s, s.cfg.axes?.[1] ?? "STRATEGIC IMPORTANCE →", 0, 0, 10, alpha(C.paper, 0.5), 700, "center");
  ctx.restore();

  // the organization being assessed
  const px = x0 + dx * gw;
  const py = y0 + dy * gh;
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = alpha(C.sky, 0.5);
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px, y0 + gh);
  ctx.moveTo(px, py);
  ctx.lineTo(x0, py);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(px, py, 12 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(C.blue, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fillStyle = C.blue;
  ctx.fill();
}

/* ---------- Insight: what a CRM does along the donor journey ---------- */

const JOURNEY = [
  { name: "Visitor", does: "Capture & segment" },
  { name: "First gift", does: "Instant receipt + thank-you" },
  { name: "Monthly", does: "Retention journeys" },
  { name: "Advocate", does: "Peer fundraising tools" },
];

function crm(ctx: Ctx, s: S) {
  background(ctx, s, 0.8, 0.2);
  const { w, h, t } = s;
  const at = (u: number) => ({
    x: w * (0.1 + 0.8 * u),
    y: h * (0.74 - 0.42 * u + 0.07 * Math.sin(u * Math.PI * 2)),
  });

  ctx.strokeStyle = alpha(C.sky, 0.3);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const p = at(i / 80);
    if (i) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
  }
  ctx.stroke();

  // supporters moving along the journey
  for (let i = 0; i < 16; i++) {
    const u = (t * 0.07 + i / 16) % 1;
    const p = at(u);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5 + u * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = alpha(u > 0.66 ? "#ffffff" : C.sky, 0.85);
    ctx.fill();
  }

  const journey = s.cfg.stages ?? JOURNEY;
  const auto = Math.floor(t * 0.45) % journey.length;
  const pointed = Math.round(clamp((s.px - 0.1) / 0.8) * (journey.length - 1));
  const active = s.hover > 0.4 ? pointed : auto;
  journey.forEach((stage, i) => {
    const p = at(i / (journey.length - 1));
    const on = i === active;
    ctx.beginPath();
    ctx.arc(p.x, p.y, on ? 13 : 8, 0, Math.PI * 2);
    ctx.fillStyle = on ? C.blue : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, on ? 0.9 : 0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    label(ctx, s, stage.name, clamp(p.x, 34, w - 34), p.y - 26, on ? 13 : 11, on ? "#fff" : alpha(C.paper, 0.55), 700, "center");
    if (on) {
      ctx.font = `600 11px ${s.font}`;
      const tw = ctx.measureText(stage.does).width + 22;
      const bx = clamp(p.x - tw / 2, 8, w - tw - 8);
      pill(ctx, bx, p.y + 20, tw, 26, 13);
      ctx.fillStyle = alpha(C.paper, 0.95);
      ctx.fill();
      label(ctx, s, stage.does, bx + tw / 2, p.y + 34, 11, C.ink, 700, "center");
    }
  });
  label(ctx, s, s.cfg.title ?? "DONOR JOURNEY", 20, 24, 11, alpha(C.paper, 0.55), 700);
}

/* ---------- Insight: seven questions before entering a market ---------- */

const QUESTIONS = ["Demand", "Competition", "Regulation", "Pricing", "Channels", "Partners", "Risk"];

function checklist(ctx: Ctx, s: S) {
  background(ctx, s, 0.85, 0.15);
  const { w, h, t } = s;
  const items = s.cfg.items ?? QUESTIONS;
  const pts = items.map((_, i) => ({
    x: w * (0.1 + (0.8 * i) / (items.length - 1)),
    y: h * (0.8 - (0.56 * i) / (items.length - 1)),
  }));
  // how far along the questions you are: pointer on hover, slow loop when idle
  const progress = s.hover > 0.4 ? clamp(s.px * 1.1) * items.length : (t * 0.7) % (items.length + 1.5);
  const done = Math.min(Math.floor(progress), items.length);

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (i < done - 1) {
      ctx.setLineDash([]);
      ctx.strokeStyle = C.blue;
      ctx.lineWidth = 2.5;
    } else {
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = alpha(C.paper, 0.22);
      ctx.lineWidth = 1.5;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  pts.forEach((p, i) => {
    const answered = i < done;
    const current = i === done;
    ctx.beginPath();
    ctx.arc(p.x, p.y, answered ? 9 : 7, 0, Math.PI * 2);
    ctx.fillStyle = answered ? C.blue : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, answered ? 0 : 0.35);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (answered) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - 3.5, p.y);
      ctx.lineTo(p.x - 0.5, p.y + 3);
      ctx.lineTo(p.x + 4, p.y - 3);
      ctx.stroke();
    }
    if (current) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = alpha(C.sky, 0.8);
      ctx.stroke();
      label(ctx, s, `${s.cfg.prefix ?? "Q"}${i + 1} · ${items[i]}`, clamp(p.x, 50, w - 50), p.y - 26, 12, "#fff", 700, "center");
    }
  });
  label(ctx, s, `${done}/${items.length} ${s.cfg.counter ?? "ANSWERED"}`, w - 20, h - 18, 11, done === items.length ? C.sky : alpha(C.paper, 0.55), 700, "right");
  label(ctx, s, s.cfg.title ?? "MARKET ENTRY", 20, 24, 11, alpha(C.paper, 0.55), 700);
}

const DRAW: Record<WorkKind, (ctx: Ctx, s: S) => void> = {
  giving,
  erp,
  reach,
  market,
  event: stage,
  story,
  decide,
  crm,
  checklist,
  ...EXTRA,
};

export default function WorkVisual({
  kind,
  label: aria,
  config,
  track = "self",
}: {
  kind: WorkKind;
  label: string;
  config?: VisualConfig;
  // "window": follow the pointer anywhere on screen (for cards that themselves follow the cursor).
  track?: "self" | "window";
}) {
  const cfg = useRef<VisualConfig>(config ?? {});
  useEffect(() => {
    cfg.current = config ?? {};
  }, [config]);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    // next/font registers the family under a generated name; read it from the CSS variable.
    const font = getComputedStyle(document.body).getPropertyValue("--font-accent").trim() || "sans-serif";
    const s: S = { w: 0, h: 0, t: 0, dt: 0, px: 0.6, py: 0.45, hover: 0, font, mem: {}, cfg: cfg.current };
    const target = { x: 0.6, y: 0.45, hover: 0 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      // Drawings are designed around a ~460px-wide card. Larger cards scale the
      // drawing up (capped, so wide banners gain room rather than giant labels).
      const k = Math.min(1.35, Math.max(1, r.width / 460));
      ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
      s.w = r.width / k;
      s.h = r.height / k;
      DRAW[kind](ctx, s);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      target.hover = 1;
    };
    const leave = () => {
      target.hover = 0;
      target.x = 0.6;
      target.y = 0.45;
    };
    const moveWindow = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
      target.hover = 1;
    };
    if (track === "window") window.addEventListener("pointermove", moveWindow, { passive: true });
    else {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    }

    const frame = (now: number) => {
      // rAF timestamps can precede the performance.now() taken when animation started.
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      s.dt = reduced ? 0 : dt;
      s.t += s.dt;
      const k = 1 - Math.exp(-dt * 7);
      s.px += (target.x - s.px) * k;
      s.py += (target.y - s.py) * k;
      s.hover += (target.hover - s.hover) * (1 - Math.exp(-dt * 4));
      s.cfg = cfg.current;
      DRAW[kind](ctx, s);
      raf = requestAnimationFrame(frame);
    };

    // Animate only while the card is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", moveWindow);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [kind, track]);

  return (
    <div ref={wrap} role="img" aria-label={aria} className="relative h-full w-full bg-ink">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
