import { C, alpha, background, caption, clamp, label, mix, pill, type Ctx, type Draw, type S } from "@/lib/canvasKit";

// Visuals for insight articles, the service lines and the About page.

const pointerOr = (s: S, idle: number) => (s.hover > 0.3 ? s.px : idle);

/* Insight — awareness: one message, consistent across every channel. */
const channels: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.5);
  const { w, h, t } = s;
  const cx = w / 2;
  const cy = h * 0.53;
  const names = ["Social", "Video", "Radio", "Outdoor", "Email", "Events"];
  const pts = names.map((n, i) => {
    const a = (i / names.length) * Math.PI * 2 - Math.PI / 2;
    return { n, x: cx + Math.cos(a) * w * 0.34, y: cy + Math.sin(a) * h * 0.33 };
  });
  let pick = Math.floor(t * 0.7) % names.length;
  if (s.hover > 0.3) {
    let d = Infinity;
    pts.forEach((p, i) => {
      const dd = Math.hypot(p.x - s.px * w, p.y - s.py * h);
      if (dd < d) {
        d = dd;
        pick = i;
      }
    });
  }
  pts.forEach((p, i) => {
    const on = i === pick;
    ctx.strokeStyle = alpha(C.blue, on ? 0.9 : 0.25);
    ctx.lineWidth = on ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    const u = (t * 0.8 + i / names.length) % 1;
    ctx.beginPath();
    ctx.arc(mix(cx, p.x, u), mix(cy, p.y, u), on ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = on ? "#fff" : C.sky;
    ctx.fill();
    pill(ctx, p.x - 38, p.y - 14, 76, 28, 14);
    ctx.fillStyle = on ? C.blue : C.ink2;
    ctx.fill();
    label(ctx, s, p.n, p.x, p.y + 1, 11.5, on ? "#fff" : alpha(C.paper, 0.65), 700, "center", 66);
  });
  pill(ctx, cx - 64, cy - 26, 128, 52, 14);
  ctx.fillStyle = C.paper;
  ctx.fill();
  label(ctx, s, "One message", cx, cy - 6, 13, C.ink, 700, "center");
  pill(ctx, cx - 40, cy + 8, 80, 6, 3);
  ctx.fillStyle = alpha(C.blue, 0.6);
  ctx.fill();
  caption(ctx, s, "CONSISTENT CAMPAIGN");
};

/* Insight — automation: the process turns from manual to automatic as you move. */
const workflow: Draw = (ctx, s) => {
  background(ctx, s, 0.8, 0.3);
  const { w, h, t } = s;
  const steps = ["Request", "Approve", "Invoice", "Report"];
  const auto = pointerOr(s, 0.5 + Math.sin(t * 0.5) * 0.5);
  const gap = w * 0.8 / steps.length;
  const y = h * 0.45;
  ctx.strokeStyle = alpha(C.paper, 0.2);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.1 + gap / 2, y);
  ctx.lineTo(w * 0.9 - gap / 2, y);
  ctx.stroke();
  steps.forEach((st, i) => {
    const x = w * 0.1 + i * gap + gap / 2;
    const on = (i + 0.5) / steps.length <= auto;
    pill(ctx, x - gap * 0.42, y - 30, gap * 0.84, 60, 12);
    ctx.fillStyle = on ? C.blue : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, on ? 0 : 0.18);
    ctx.stroke();
    label(ctx, s, st, x, y - 7, 12, on ? "#fff" : alpha(C.paper, 0.7), 700, "center", gap * 0.84 - 12);
    label(ctx, s, on ? "⚡ Automated" : "✋ Manual", x, y + 13, 10, on ? alpha("#ffffff", 0.85) : alpha(C.paper, 0.4), 600, "center", gap * 0.84 - 12);
  });
  // tokens moving through: faster in automated stretches
  for (let k = 0; k < 5; k++) {
    const u = (t * (0.08 + auto * 0.2) + k / 5) % 1;
    ctx.beginPath();
    ctx.arc(mix(w * 0.1, w * 0.9, u), y + 46, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = u <= auto ? C.sky : alpha(C.paper, 0.35);
    ctx.fill();
  }
  const saved = Math.round(auto * 100);
  label(ctx, s, "Team time freed", 20, h - 40, 11, alpha(C.paper, 0.55), 700);
  pill(ctx, 20, h - 28, w - 40, 8, 4);
  ctx.fillStyle = alpha(C.paper, 0.1);
  ctx.fill();
  pill(ctx, 20, h - 28, Math.max(8, (w - 40) * auto), 8, 4);
  ctx.fillStyle = C.blue;
  ctx.fill();
  label(ctx, s, `${saved}%`, w - 20, h - 40, 11, C.sky, 700, "right");
  caption(ctx, s, "MANUAL → AUTOMATED");
};

/* Insight — events: before, during and after on one timeline. */
const timeline: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.2);
  const { w, h, t } = s;
  const at = pointerOr(s, (t * 0.12) % 1.1);
  const phases = [
    { n: "Before", items: ["Objective", "Identity", "Content plan"] },
    { n: "During", items: ["Live coverage", "Interviews", "Sharing"] },
    { n: "After", items: ["Recap", "Repurpose", "Review"] },
  ];
  const x0 = w * 0.08;
  const x1 = w * 0.92;
  const y = h * 0.32;
  ctx.strokeStyle = alpha(C.paper, 0.18);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.strokeStyle = C.blue;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(mix(x0, x1, clamp(at)), y);
  ctx.stroke();
  const seg = (x1 - x0) / 3;
  phases.forEach((p, i) => {
    const px = x0 + i * seg + seg / 2;
    const reached = at >= i / 3;
    pill(ctx, px - 38, y - 15, 76, 30, 15);
    ctx.fillStyle = reached ? C.blue : C.ink2;
    ctx.fill();
    label(ctx, s, p.n, px, y + 1, 12, reached ? "#fff" : alpha(C.paper, 0.6), 700, "center", 64);
    p.items.forEach((it, k) => {
      const done = at >= (i + (k + 1) / 4) / 3;
      const iy = y + 46 + k * 30;
      ctx.beginPath();
      ctx.arc(px - 44, iy, 7, 0, Math.PI * 2);
      ctx.fillStyle = done ? C.sky : "transparent";
      ctx.fill();
      ctx.strokeStyle = alpha(C.paper, done ? 0 : 0.3);
      ctx.stroke();
      if (done) label(ctx, s, "✓", px - 44, iy + 1, 9, C.ink, 700, "center");
      label(ctx, s, it, px - 30, iy + 1, 11, done ? "#fff" : alpha(C.paper, 0.45), 600, "left", seg - 40);
    });
  });
  ctx.beginPath();
  ctx.arc(mix(x0, x1, clamp(at)), y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  caption(ctx, s, "EVENT LIFECYCLE");
};

/* Insight — impact stories: a person, their words, their voice. */
const portrait: Draw = (ctx, s) => {
  background(ctx, s, 0.3, 0.4);
  const { w, h, t } = s;
  const fx = w * 0.08;
  const fy = h * 0.14;
  const fw = w * 0.36;
  const fh = h * 0.62;
  pill(ctx, fx, fy, fw, fh, 14);
  const g = ctx.createLinearGradient(0, fy, 0, fy + fh);
  g.addColorStop(0, "#2b4c8f");
  g.addColorStop(1, "#162040");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  pill(ctx, fx, fy, fw, fh, 14);
  ctx.clip();
  ctx.fillStyle = alpha(C.paper, 0.85);
  ctx.beginPath();
  ctx.arc(fx + fw / 2, fy + fh * 0.42, fw * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(fx + fw / 2, fy + fh * 0.95, fw * 0.36, fh * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // the quote reveals as you engage
  const reveal = clamp(0.35 + s.hover * 0.65);
  label(ctx, s, "“", w * 0.5, h * 0.2, 44, C.blue, 700);
  [0.42, 0.36, 0.4, 0.22].forEach((len, i) => {
    const full = w * len;
    pill(ctx, w * 0.52, h * (0.3 + i * 0.09), full * clamp(reveal * 1.3 - i * 0.18), 9, 5);
    ctx.fillStyle = alpha(C.paper, i === 3 ? 0.4 : 0.8);
    ctx.fill();
  });
  label(ctx, s, "— Programme participant", w * 0.52, h * 0.68, 11, alpha(C.paper, 0.5), 600);
  // voice waveform
  for (let i = 0; i < 46; i++) {
    const x = w * 0.08 + i * ((w * 0.84) / 46);
    const amp = (Math.sin(i * 0.7 + t * 6) * 0.5 + 0.5) * (0.3 + s.hover * 0.7) * h * 0.08 + 2;
    ctx.fillStyle = i / 46 < (t * 0.1) % 1 ? C.sky : alpha(C.paper, 0.25);
    ctx.fillRect(x, h * 0.87 - amp / 2, 3, amp);
  }
  caption(ctx, s, "IMPACT STORY");
};

/* Insight — website: hover to restructure a messy page into a clear one. */
const wireframe: Draw = (ctx, s) => {
  background(ctx, s, 0.6, 0.2);
  const { w, h } = s;
  const bx = w * 0.08;
  const by = h * 0.12;
  const bw = w * 0.84;
  const bh = h * 0.78;
  pill(ctx, bx, by, bw, bh, 14);
  ctx.fillStyle = alpha(C.paper, 0.05);
  ctx.fill();
  ctx.strokeStyle = alpha(C.paper, 0.15);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(bx + 16 + i * 11, by + 14, 3, 0, Math.PI * 2);
    ctx.fillStyle = alpha(C.paper, 0.3);
    ctx.fill();
  }
  const k = clamp(s.hover * 1.1);
  const e = k * k * (3 - 2 * k);
  // [messy x,y,w,h] → [ordered x,y,w,h], as fractions of the browser body
  const blocks: [number[], number[], string][] = [
    [[0.55, 0.62, 0.36, 0.14], [0.05, 0.1, 0.9, 0.22], C.blue], // hero
    [[0.05, 0.08, 0.3, 0.2], [0.05, 0.38, 0.28, 0.24], alpha(C.paper, 0.25)],
    [[0.62, 0.12, 0.28, 0.3], [0.36, 0.38, 0.28, 0.24], alpha(C.paper, 0.25)],
    [[0.2, 0.45, 0.25, 0.22], [0.67, 0.38, 0.28, 0.24], alpha(C.paper, 0.25)],
    [[0.4, 0.3, 0.14, 0.08], [0.35, 0.72, 0.3, 0.1], C.sky], // call to action
  ];
  const ix = bx + 14;
  const iy = by + 30;
  const iw = bw - 28;
  const ih = bh - 42;
  blocks.forEach(([a, b, col]) => {
    const r = [0, 1, 2, 3].map((j) => mix(a[j], b[j], e));
    pill(ctx, ix + r[0] * iw, iy + r[1] * ih, r[2] * iw, r[3] * ih, 8);
    ctx.fillStyle = col;
    ctx.fill();
  });
  label(ctx, s, e > 0.5 ? "Restructured ✓" : "Before", w - 24, by + 15, 11, e > 0.5 ? C.sky : alpha(C.paper, 0.5), 700, "right");
  caption(ctx, s, "CLEAR JOURNEY");
};

/* Insight — KPIs: move the target and see which measures are on track. */
const kpis: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.2);
  const { w, h, t } = s;
  const names = ["Leads", "Conversion", "Retention"];
  const series = [
    [0.3, 0.38, 0.35, 0.5, 0.58, 0.66, 0.72],
    [0.42, 0.4, 0.45, 0.43, 0.48, 0.5, 0.52],
    [0.6, 0.62, 0.66, 0.7, 0.69, 0.74, 0.8],
  ];
  const target = s.hover > 0.3 ? clamp(1 - s.py, 0.2, 0.9) : 0.55 + Math.sin(t * 0.6) * 0.15;
  const tw = (w - 48) / 3;
  names.forEach((n, i) => {
    const x = 16 + i * (tw + 8);
    const y = h * 0.16;
    const th = h * 0.72;
    pill(ctx, x, y, tw, th, 12);
    ctx.fillStyle = C.ink2;
    ctx.fill();
    const last = series[i][series[i].length - 1];
    const ok = last >= target;
    label(ctx, s, n, x + 12, y + 18, 11, alpha(C.paper, 0.6), 700);
    label(ctx, s, `${Math.round(last * 100)}`, x + 12, y + 46, 24, "#fff", 700);
    const gy = (v: number) => y + th - 20 - v * (th - 90);
    ctx.strokeStyle = ok ? C.sky : alpha(C.paper, 0.45);
    ctx.lineWidth = 2;
    ctx.beginPath();
    series[i].forEach((v, k) => {
      const px = x + 12 + (k / (series[i].length - 1)) * (tw - 24);
      if (k) ctx.lineTo(px, gy(v));
      else ctx.moveTo(px, gy(v));
    });
    ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = alpha(C.blue, 0.9);
    ctx.beginPath();
    ctx.moveTo(x + 10, gy(target));
    ctx.lineTo(x + tw - 10, gy(target));
    ctx.stroke();
    ctx.setLineDash([]);
    pill(ctx, x + 12, y + th - 14 - 22, ok ? 66 : 86, 20, 10);
    ctx.fillStyle = ok ? C.blue : alpha(C.paper, 0.12);
    ctx.fill();
    label(ctx, s, ok ? "On track" : "Below target", x + 12 + (ok ? 33 : 43), y + th - 25, 10, "#fff", 700, "center", ok ? 58 : 78);
  });
  caption(ctx, s, "KPI REVIEW");
};

/* Outsourcing services — six divisions as a fanned deck; point to draw one out. */
const deck: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.6);
  const { w, h, t } = s;
  const names = s.cfg.items ?? ["Foundation", "Marketing", "Web", "Software", "Media", "Events"];
  const n = names.length;
  const pick = s.hover > 0.3 ? Math.min(n - 1, Math.floor(s.px * n)) : Math.floor(t * 0.6) % n;
  const lift = (s.mem.lift ??= names.map(() => 0)) as number[];
  const cw = Math.min(w * 0.2, 120);
  const ch = cw * 1.4;
  const pivotY = h * 1.15;
  names.forEach((nm, i) => {
    lift[i] += ((i === pick ? 1 : 0) - lift[i]) * (1 - Math.exp(-s.dt * 9));
    const a = (i - (n - 1) / 2) * 0.16;
    ctx.save();
    ctx.translate(w / 2, pivotY);
    ctx.rotate(a * (1 - lift[i] * 0.6));
    ctx.translate(0, -h * 0.72 - lift[i] * 26);
    pill(ctx, -cw / 2, -ch / 2, cw, ch, 12);
    ctx.fillStyle = i === pick ? C.blue : i % 2 ? C.ink2 : "#262636";
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, i === pick ? 0 : 0.18);
    ctx.stroke();
    label(ctx, s, String(i + 1).padStart(2, "0"), -cw / 2 + 12, -ch / 2 + 18, 11, i === pick ? alpha("#ffffff", 0.75) : C.sky, 700);
    label(ctx, s, nm, 0, ch / 2 - 22, 12, "#fff", 700, "center", cw - 14);
    ctx.restore();
  });
  caption(ctx, s, `${n} INTEGRATED DIVISIONS`);
};

// The brand's arrow, drawn as a chevron pointing up-right.
function brandArrow(ctx: Ctx, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(0, -size * 0.75);
  ctx.lineTo(0, -size * 0.28);
  ctx.lineTo(-size, -size * 0.28);
  ctx.lineTo(-size, size * 0.28);
  ctx.lineTo(0, size * 0.28);
  ctx.lineTo(0, size * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* Investment & business growth — a staged plan, the brand arrow climbing it. */
const growthplan: Draw = (ctx, s) => {
  background(ctx, s, 0.85, 0.1);
  const { w, h, t } = s;
  const names = s.cfg.items ?? ["Research", "Develop", "Invest", "Enter", "Partner", "Plan", "Advise"];
  const n = names.length;
  const at = pointerOr(s, (t * 0.1) % 1.05);
  const bw = (w * 0.84) / n;
  const base = h * 0.82;
  let top = { x: 0, y: 0 };
  names.forEach((nm, i) => {
    const x = w * 0.08 + i * bw;
    const hh = h * (0.12 + (i / (n - 1)) * 0.5);
    const on = (i + 0.5) / n <= at;
    const g = ctx.createLinearGradient(0, base - hh, 0, base);
    g.addColorStop(0, on ? C.blue : alpha(C.paper, 0.12));
    g.addColorStop(1, on ? alpha(C.blue, 0.2) : alpha(C.paper, 0.03));
    pill(ctx, x + 4, base - hh, bw - 8, hh, 8);
    ctx.fillStyle = g;
    ctx.fill();
    label(ctx, s, nm, x + bw / 2, base + 14, 9.5, on ? "#fff" : alpha(C.paper, 0.4), 700, "center", bw - 4);
    if (on) top = { x: x + bw / 2, y: base - hh };
  });
  if (top.y) brandArrow(ctx, top.x, top.y - 24 + Math.sin(t * 3) * 3, 16, C.sky);
  caption(ctx, s, "GROWTH PLAN");
};

/* About — Build, Execute, Grow. */
const bxg: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.3);
  const { w, h, t } = s;
  const phases = ["Build", "Execute", "Grow"];
  const pick = s.hover > 0.3 ? Math.min(2, Math.floor(s.px * 3)) : Math.floor(t * 0.5) % 3;
  const cw = w / 3;
  phases.forEach((p, i) => {
    const cx = cw * i + cw / 2;
    const cy = h * 0.46;
    const on = i === pick;
    const col = on ? C.blue : alpha(C.paper, 0.35);
    if (i === 0) {
      for (let k = 0; k < 3; k++) {
        pill(ctx, cx - 34 + k * 6, cy + 22 - k * 22, 68 - k * 12, 18, 5);
        ctx.fillStyle = col;
        ctx.fill();
      }
    } else if (i === 1) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * (on ? 1.4 : 0.3));
      ctx.fillStyle = col;
      ctx.beginPath();
      for (let k = 0; k < 20; k++) {
        const r = k % 2 ? 34 : 27;
        const a = (k / 20) * Math.PI * 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = C.ink;
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      brandArrow(ctx, cx, cy + (on ? Math.sin(t * 3) * 4 : 0), 30, col);
    }
    label(ctx, s, `${p}.`, cx, h * 0.8, on ? 20 : 16, on ? "#fff" : alpha(C.paper, 0.5), 700, "center");
    if (i < 2) {
      ctx.strokeStyle = alpha(C.paper, 0.12);
      ctx.beginPath();
      ctx.moveTo(cw * (i + 1), h * 0.25);
      ctx.lineTo(cw * (i + 1), h * 0.85);
      ctx.stroke();
    }
  });
  caption(ctx, s, "HOW OP DEV WORKS");
};

export const CONTENT_VISUALS = { channels, workflow, timeline, portrait, wireframe, kpis, deck, growthplan, bxg } satisfies Record<
  string,
  (ctx: Ctx, s: S) => void
>;
