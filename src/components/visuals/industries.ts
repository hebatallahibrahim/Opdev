import { C, alpha, background, caption, clamp, label, mix, pill, type Ctx, type Draw, type S } from "@/lib/canvasKit";

// One visual per industry page — each tells that sector's story and reacts to the pointer.

const nearest = (pts: { x: number; y: number }[], x: number, y: number) => {
  let best = 0;
  let d = Infinity;
  pts.forEach((p, i) => {
    const dd = Math.hypot(p.x - x, p.y - y);
    if (dd < d) {
      d = dd;
      best = i;
    }
  });
  return best;
};

/* Corporate & Enterprise — one structure: hover a team, see its line to leadership. */
const orgchart: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.15);
  const { w, h, t } = s;
  const top = { x: w / 2, y: h * 0.2 };
  const depts = [0.2, 0.5, 0.8].map((u) => ({ x: w * u, y: h * 0.48 }));
  const teams = depts.flatMap((d) => [-1, 1].map((k) => ({ x: d.x + k * w * 0.085, y: h * 0.76, parent: d })));
  const idle = Math.floor(t * 0.6) % teams.length;
  const active = s.hover > 0.3 ? nearest(teams, s.px * w, s.py * h) : idle;
  const path = teams[active] ?? teams[0];

  const link = (a: { x: number; y: number }, b: { x: number; y: number }, on: boolean) => {
    ctx.strokeStyle = on ? C.blue : alpha(C.paper, 0.18);
    ctx.lineWidth = on ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x, (a.y + b.y) / 2);
    ctx.lineTo(b.x, (a.y + b.y) / 2);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  depts.forEach((d) => link(top, d, d === path.parent));
  teams.forEach((tm) => link(tm.parent, tm, tm === path));

  const node = (x: number, y: number, wd: number, text: string, on: boolean, strong = false) => {
    pill(ctx, x - wd / 2, y - 15, wd, 30, 15);
    ctx.fillStyle = on ? C.blue : strong ? C.paper : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, on ? 0 : 0.18);
    ctx.stroke();
    label(ctx, s, text, x, y + 1, 11.5, strong && !on ? C.ink : on ? "#fff" : alpha(C.paper, 0.75), 700, "center", wd - 12);
  };
  node(top.x, top.y, 104, "Leadership", true, true);
  ["Operations", "Finance", "Comms"].forEach((n, i) => node(depts[i].x, depts[i].y, 92, n, depts[i] === path.parent));
  // Teams as numbered dots — compact enough for narrow cards.
  teams.forEach((tm, i) => {
    const on = tm === path;
    ctx.beginPath();
    ctx.arc(tm.x, tm.y, on ? 15 : 12, 0, Math.PI * 2);
    ctx.fillStyle = on ? C.blue : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, on ? 0 : 0.2);
    ctx.stroke();
    label(ctx, s, String(i + 1), tm.x, tm.y + 1, 11, on ? "#fff" : alpha(C.paper, 0.7), 700, "center");
  });
  label(ctx, s, "Teams", w / 2, h * 0.92, 10.5, alpha(C.paper, 0.4), 700, "center");
  caption(ctx, s, "ONE STRUCTURE");
};

/* Startups — the growth curve: scrub across to move through milestones. */
const launch: Draw = (ctx, s) => {
  background(ctx, s, 0.85, 0.15);
  const { w, h, t } = s;
  const x0 = w * 0.1;
  const x1 = w * 0.9;
  const y0 = h * 0.82;
  const curve = (u: number) => ({ x: mix(x0, x1, u), y: y0 - Math.pow(u, 2.6) * h * 0.62 });
  const head = s.hover > 0.3 ? clamp((s.px * w - x0) / (x1 - x0)) : (t * 0.12) % 1;

  ctx.strokeStyle = alpha(C.paper, 0.15);
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const p = curve(i / 60);
    if (i) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  const grad = ctx.createLinearGradient(x0, 0, x1, 0);
  grad.addColorStop(0, C.sky);
  grad.addColorStop(1, C.blue);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 60 * head; i++) {
    const p = curve(i / 60);
    if (i) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
  }
  ctx.stroke();

  const stones = [
    { u: 0.15, n: "Idea" },
    { u: 0.38, n: "MVP" },
    { u: 0.6, n: "Launch" },
    { u: 0.8, n: "Traction" },
    { u: 0.97, n: "Scale" },
  ];
  stones.forEach((m) => {
    const p = curve(m.u);
    const done = head >= m.u;
    ctx.beginPath();
    ctx.arc(p.x, p.y, done ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = done ? "#fff" : alpha(C.paper, 0.3);
    ctx.fill();
    label(ctx, s, m.n, p.x, p.y + (m.u > 0.7 ? -18 : 18), 11, done ? "#fff" : alpha(C.paper, 0.4), 700, "center");
  });
  const hp = curve(head);
  ctx.beginPath();
  ctx.arc(hp.x, hp.y, 9 + Math.sin(t * 5) * 2, 0, Math.PI * 2);
  ctx.fillStyle = C.blue;
  ctx.fill();
  caption(ctx, s, "GROWTH CURVE");
};

/* NGOs — from donor to impact: gifts travel to the projects they fund. */
const impact: Draw = (ctx, s) => {
  background(ctx, s, 0.3, 0.5);
  const { w, h, t } = s;
  const donors = [0.22, 0.4, 0.58, 0.76].map((v) => ({ x: w * 0.14, y: h * v }));
  const projects = [
    { x: w * 0.82, y: h * 0.3, n: "Education" },
    { x: w * 0.82, y: h * 0.52, n: "Health" },
    { x: w * 0.82, y: h * 0.74, n: "Water" },
  ];
  const pick = s.hover > 0.3 ? nearest(projects, s.px * w, s.py * h) : Math.floor(t * 0.5) % projects.length;

  donors.forEach((d, i) => {
    projects.forEach((p, j) => {
      const on = j === pick;
      const cx = (d.x + p.x) / 2;
      ctx.strokeStyle = alpha(on ? C.blue : C.paper, on ? 0.5 : 0.08);
      ctx.lineWidth = on ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.bezierCurveTo(cx, d.y, cx, p.y, p.x, p.y);
      ctx.stroke();
      if (on) {
        const u = (t * 0.35 + i * 0.22) % 1;
        const bx = (1 - u) ** 3 * d.x + 3 * (1 - u) ** 2 * u * cx + 3 * (1 - u) * u * u * cx + u ** 3 * p.x;
        const by = (1 - u) ** 3 * d.y + 3 * (1 - u) ** 2 * u * d.y + 3 * (1 - u) * u * u * p.y + u ** 3 * p.y;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = C.sky;
        ctx.fill();
      }
    });
    ctx.beginPath();
    ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, 0.35);
    ctx.stroke();
    label(ctx, s, "♥", d.x, d.y + 1, 10, C.sky, 700, "center");
  });
  projects.forEach((p, j) => {
    const on = j === pick;
    pill(ctx, p.x - 44, p.y - 15, 88, 30, 15);
    ctx.fillStyle = on ? C.blue : C.ink2;
    ctx.fill();
    label(ctx, s, p.n, p.x, p.y + 1, 12, on ? "#fff" : alpha(C.paper, 0.6), 700, "center", 76);
  });
  label(ctx, s, "Donors", w * 0.14, h * 0.9, 11, alpha(C.paper, 0.45), 700, "center");
  label(ctx, s, "Projects", w * 0.82, h * 0.9, 11, alpha(C.paper, 0.45), 700, "center");
  caption(ctx, s, "FROM GIFT TO IMPACT");
};

/* Healthcare — a calm, steady pulse; the patient journey runs underneath. */
const pulse: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.4);
  const { w, h, t } = s;
  const mid = h * 0.45;
  const beat = (x: number) => {
    const p = ((x / w) * 3 + t * 0.6) % 1;
    if (p < 0.4) return 0;
    if (p < 0.45) return -0.18;
    if (p < 0.5) return 0.9;
    if (p < 0.55) return -0.45;
    if (p < 0.6) return 0.1;
    return 0;
  };
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.strokeStyle = C.sky;
  ctx.shadowColor = C.blue;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 3) {
    const y = mid - beat(x) * h * 0.22;
    if (x) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  const steps = ["Find care", "Book", "Visit", "Follow-up"];
  const active = s.hover > 0.3 ? Math.min(3, Math.floor(s.px * 4)) : Math.floor(t * 0.5) % 4;
  const gap = (w - 40) / 4;
  steps.forEach((st, i) => {
    const x = 20 + i * gap;
    pill(ctx, x + 4, h * 0.78, gap - 8, 30, 15);
    ctx.fillStyle = i === active ? C.blue : i < active ? alpha(C.blue, 0.25) : C.ink2;
    ctx.fill();
    label(ctx, s, st, x + gap / 2, h * 0.78 + 16, 11, i <= active ? "#fff" : alpha(C.paper, 0.5), 700, "center", gap - 16);
  });
  caption(ctx, s, "PATIENT JOURNEY");
};

/* Education — climb the levels toward graduation. */
const learning: Draw = (ctx, s) => {
  background(ctx, s, 0.8, 0.2);
  const { w, h, t } = s;
  const levels = ["Enquire", "Enrol", "Learn", "Practice", "Graduate"];
  const n = levels.length;
  const sw = (w * 0.8) / n;
  const at = s.hover > 0.3 ? clamp(s.px * 1.1) * (n - 0.01) : (t * 0.5) % n;
  const cur = Math.floor(at);
  levels.forEach((lv, i) => {
    const x = w * 0.1 + i * sw;
    const top = h * 0.82 - (i + 1) * h * 0.12;
    pill(ctx, x + 3, top, sw - 6, h * 0.82 - top, 8);
    const g = ctx.createLinearGradient(0, top, 0, h * 0.82);
    g.addColorStop(0, i <= cur ? C.blue : alpha(C.paper, 0.1));
    g.addColorStop(1, i <= cur ? alpha(C.blue, 0.25) : alpha(C.paper, 0.03));
    ctx.fillStyle = g;
    ctx.fill();
    label(ctx, s, lv, x + sw / 2, h * 0.9, 10.5, i <= cur ? "#fff" : alpha(C.paper, 0.4), 700, "center", sw - 4);
    if (i === cur) {
      const bob = Math.sin(t * 4) * 3;
      ctx.beginPath();
      ctx.arc(x + sw / 2, top - 16 + bob, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
  });
  // mortarboard over the last step
  const gx = w * 0.1 + (n - 0.5) * sw;
  const gy = h * 0.82 - n * h * 0.12 - 42;
  ctx.fillStyle = cur === n - 1 ? C.sky : alpha(C.paper, 0.25);
  ctx.beginPath();
  ctx.moveTo(gx - 22, gy);
  ctx.lineTo(gx, gy - 10);
  ctx.lineTo(gx + 22, gy);
  ctx.lineTo(gx, gy + 10);
  ctx.closePath();
  ctx.fill();
  caption(ctx, s, "LEARNING PATH");
};

/* Manufacturing — the line speeds up as operations connect. */
function gear(ctx: Ctx, x: number, y: number, r: number, teeth: number, a: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const rr = i % 2 ? r : r * 0.78;
    const an = (i / (teeth * 2)) * Math.PI * 2;
    ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
const factory: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.2);
  const { w, h } = s;
  const speed = 0.6 + s.hover * 1.6;
  const spin = ((s.mem.spin as number) ?? 0) + s.dt * speed;
  s.mem.spin = spin;
  gear(ctx, w * 0.3, h * 0.32, 34, 10, spin, alpha(C.paper, 0.85));
  gear(ctx, w * 0.3 + 52, h * 0.32 + 22, 22, 8, -spin * 1.5, C.blue);
  gear(ctx, w * 0.72, h * 0.3, 28, 9, -spin * 1.2, alpha(C.sky, 0.8));

  const by = h * 0.7;
  pill(ctx, w * 0.06, by, w * 0.88, 16, 8);
  ctx.fillStyle = C.ink2;
  ctx.fill();
  for (let x = w * 0.08; x < w * 0.92; x += 18) {
    ctx.fillStyle = alpha(C.paper, 0.2);
    ctx.fillRect(x - ((spin * 20) % 18), by + 7, 8, 2);
  }
  const offs = (spin * 40) % (w * 0.22);
  for (let i = -1; i < 5; i++) {
    const x = w * 0.08 + i * w * 0.22 + offs;
    if (x < w * 0.06 || x > w * 0.86) continue;
    pill(ctx, x, by - 30, 34, 28, 5);
    ctx.fillStyle = i % 2 ? C.blue : alpha(C.paper, 0.8);
    ctx.fill();
  }
  const rate = Math.round(60 + s.hover * 38);
  label(ctx, s, `Throughput ${rate}%`, w - 20, h - 22, 12, s.hover > 0.5 ? C.sky : alpha(C.paper, 0.55), 700, "right");
  caption(ctx, s, "CONNECTED OPERATIONS");
};

/* Retail — pick up a product; the basket fills. */
const store: Draw = (ctx, s) => {
  background(ctx, s, 0.7, 0.2);
  const { w, h, t } = s;
  const cw = w * 0.24;
  const cards = [0, 1, 2].map((i) => ({ x: w * 0.1 + i * (cw + w * 0.04), y: h * 0.26 }));
  const pick = s.hover > 0.3 ? nearest(cards.map((c) => ({ x: c.x + cw / 2, y: c.y + h * 0.25 })), s.px * w, s.py * h) : Math.floor(t * 0.6) % 3;
  const lift = (s.mem.lift ??= [0, 0, 0]) as number[];
  cards.forEach((c, i) => {
    lift[i] += ((i === pick ? 1 : 0) - lift[i]) * (1 - Math.exp(-s.dt * 8));
    const y = c.y - lift[i] * 12;
    pill(ctx, c.x, y, cw, h * 0.5, 14);
    ctx.fillStyle = C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(i === pick ? C.blue : C.paper, i === pick ? 0.9 : 0.12);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    const img = ctx.createLinearGradient(0, y, 0, y + h * 0.26);
    img.addColorStop(0, [C.blue, C.lav, C.sky][i]);
    img.addColorStop(1, alpha(C.ink, 0.2));
    pill(ctx, c.x + 8, y + 8, cw - 16, h * 0.26, 10);
    ctx.fillStyle = img;
    ctx.fill();
    pill(ctx, c.x + 10, y + h * 0.31, cw * 0.6, 7, 4);
    ctx.fillStyle = alpha(C.paper, 0.35);
    ctx.fill();
    pill(ctx, c.x + 10, y + h * 0.39, cw - 20, 22, 11);
    ctx.fillStyle = i === pick ? C.blue : alpha(C.paper, 0.08);
    ctx.fill();
    label(ctx, s, i === pick ? "Added ✓" : "Add to cart", c.x + cw / 2, y + h * 0.39 + 12, 10.5, "#fff", 700, "center", cw - 24);
  });
  const count = 1 + pick + Math.round(s.hover);
  pill(ctx, w - 108, 14, 88, 30, 15);
  ctx.fillStyle = C.blue;
  ctx.fill();
  label(ctx, s, `Cart · ${count}`, w - 64, 30, 12, "#fff", 700, "center");
  caption(ctx, s, "SHOP · ADD · BUY");
};

/* Real estate — the skyline rises where you point. */
const skyline: Draw = (ctx, s) => {
  background(ctx, s, 0.6, 0.15);
  const { w, h, t } = s;
  const base = h * 0.84;
  const heights = [0.32, 0.5, 0.38, 0.62, 0.44, 0.56, 0.3];
  const bw = (w * 0.8) / heights.length;
  const built = s.hover > 0.3 ? s.px : 0.5 + Math.sin(t * 0.4) * 0.45;
  heights.forEach((hh, i) => {
    const x = w * 0.1 + i * bw;
    const u = (i + 0.5) / heights.length;
    const k = clamp((built - u) * 4 + 0.5);
    const top = base - hh * h * mix(0.35, 1, k);
    if (k > 0.05) {
      const g = ctx.createLinearGradient(0, top, 0, base);
      g.addColorStop(0, alpha(C.blue, 0.9 * k));
      g.addColorStop(1, alpha(C.blue, 0.15 * k));
      ctx.fillStyle = g;
      ctx.fillRect(x + 4, top, bw - 8, base - top);
      for (let wy = top + 10; wy < base - 8; wy += 14) {
        for (let wx = x + 10; wx < x + bw - 12; wx += 12) {
          ctx.fillStyle = alpha(C.paper, (Math.sin(wx * 3 + wy) > 0.3 ? 0.55 : 0.12) * k);
          ctx.fillRect(wx, wy, 5, 6);
        }
      }
    }
    ctx.strokeStyle = alpha(C.paper, 0.3 * (1 - k) + 0.1);
    ctx.setLineDash(k < 1 ? [3, 4] : []);
    ctx.strokeRect(x + 4, base - hh * h, bw - 8, hh * h);
    ctx.setLineDash([]);
  });
  // crane at the build front
  const cx = w * 0.1 + clamp(built) * w * 0.8;
  ctx.strokeStyle = C.sky;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, base);
  ctx.lineTo(cx, h * 0.14);
  ctx.lineTo(cx + 60, h * 0.14);
  ctx.moveTo(cx - 20, h * 0.14);
  ctx.lineTo(cx, h * 0.14);
  ctx.moveTo(cx + 44, h * 0.14);
  ctx.lineTo(cx + 44, h * 0.3);
  ctx.stroke();
  ctx.fillStyle = alpha(C.paper, 0.15);
  ctx.fillRect(0, base, w, 2);
  caption(ctx, s, "FROM PLAN TO SKYLINE");
};

/* Hospitality — tables fill up; point at one to reserve it. */
const tables: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.5);
  const { w, h, t } = s;
  const spots: { x: number; y: number; seats: number }[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) spots.push({ x: w * (0.17 + c * 0.22), y: h * (0.3 + r * 0.24), seats: (r + c) % 2 ? 4 : 2 });
  const pick = s.hover > 0.3 ? nearest(spots, s.px * w, s.py * h) : -1;
  const booked = Math.floor((t * 1.2) % (spots.length + 4));
  spots.forEach((sp, i) => {
    const on = i === pick;
    const full = i < booked;
    for (let k = 0; k < sp.seats; k++) {
      const a = (k / sp.seats) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(sp.x + Math.cos(a) * 24, sp.y + Math.sin(a) * 24, 5, 0, Math.PI * 2);
      ctx.fillStyle = alpha(C.paper, full || on ? 0.6 : 0.15);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = on ? C.blue : full ? alpha(C.blue, 0.45) : C.ink2;
    ctx.fill();
    ctx.strokeStyle = alpha(C.paper, 0.25);
    ctx.stroke();
    if (on) {
      pill(ctx, sp.x - 46, sp.y - 54, 92, 24, 12);
      ctx.fillStyle = C.paper;
      ctx.fill();
      label(ctx, s, `Reserved · ${19 + (i % 4)}:00`, sp.x, sp.y - 41, 10.5, C.ink, 700, "center", 80);
    }
  });
  label(ctx, s, `${Math.min(booked, spots.length)}/${spots.length} tables booked`, w - 20, 24, 11, alpha(C.paper, 0.55), 700, "right");
  caption(ctx, s, "TONIGHT");
};

/* Professional services — authority radiates: the more visible, the wider the reach. */
const authority: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.5);
  const { w, h, t } = s;
  const key = `${Math.round(w)}x${Math.round(h)}`;
  if (s.mem.key !== key) {
    const pts: [number, number][] = [];
    for (let i = 0; i < 46; i++) {
      const a = i * 2.39996;
      const r = 40 + Math.sqrt(i / 46) * Math.min(w, h) * 0.45;
      pts.push([w / 2 + Math.cos(a) * r * 1.3, h / 2 + Math.sin(a) * r * 0.85]);
    }
    s.mem.pts = pts;
    s.mem.key = key;
  }
  const pts = s.mem.pts as [number, number][];
  const cx = mix(w / 2, s.px * w, s.hover * 0.6);
  const cy = mix(h / 2, s.py * h, s.hover * 0.6);
  const reach = mix(90, 190, s.hover) + Math.sin(t * 1.5) * 8;
  for (const [x, y] of pts) {
    const d = Math.hypot(x - cx, y - cy);
    const on = d < reach;
    if (on) {
      ctx.strokeStyle = alpha(C.blue, 0.35 * (1 - d / reach));
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, on ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = on ? C.sky : alpha(C.paper, 0.2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, reach, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(C.blue, 0.4);
  ctx.setLineDash([4, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = C.blue;
  ctx.fill();
  label(ctx, s, "You", cx, cy + 1, 11, "#fff", 700, "center");
  caption(ctx, s, "THOUGHT LEADERSHIP");
};

/* Travel & entertainment — a turning globe with routes to new audiences. */
const globe: Draw = (ctx, s) => {
  background(ctx, s, 0.5, 0.5);
  const { w, h, t } = s;
  const cx = w / 2;
  const cy = h * 0.55;
  const R = Math.min(w, h) * 0.36;
  const rot = t * 0.25 + (s.px - 0.5) * 2 * s.hover;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
  g.addColorStop(0, "#21407a");
  g.addColorStop(1, "#141a33");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = alpha(C.paper, 0.12);
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + (i * R) / 3, R * Math.cos(Math.asin(i / 3)), R * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const a = ((i / 6) * Math.PI + rot) % Math.PI;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(Math.cos(a)) * R, R, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // points on the sphere (lon, lat), projected
  const proj = (lon: number, lat: number) => {
    const l = lon + rot;
    return { x: cx + Math.sin(l) * Math.cos(lat) * R, y: cy - Math.sin(lat) * R, z: Math.cos(l) * Math.cos(lat) };
  };
  const home = proj(0.5, 0.45);
  const dests = [proj(1.4, 0.2), proj(-0.6, 0.65), proj(2.2, -0.3), proj(-1.5, -0.1)];
  dests.forEach((d, i) => {
    if (d.z < 0 || home.z < 0) return;
    const mx = (home.x + d.x) / 2;
    const my = Math.min(home.y, d.y) - 50;
    ctx.strokeStyle = alpha(C.sky, 0.8);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(home.x, home.y);
    ctx.quadraticCurveTo(mx, my, d.x, d.y);
    ctx.stroke();
    const u = (t * 0.4 + i * 0.25) % 1;
    const px = (1 - u) ** 2 * home.x + 2 * (1 - u) * u * mx + u * u * d.x;
    const py = (1 - u) ** 2 * home.y + 2 * (1 - u) * u * my + u * u * d.y;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = C.sky;
    ctx.fill();
  });
  if (home.z > 0) {
    ctx.beginPath();
    ctx.arc(home.x, home.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = C.blue;
    ctx.fill();
  }
  caption(ctx, s, "NEW AUDIENCES");
};

export const INDUSTRY_VISUALS = { orgchart, launch, impact, pulse, learning, factory, store, skyline, tables, authority, globe } satisfies Record<
  string,
  (ctx: Ctx, s: S) => void
>;
