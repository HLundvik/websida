import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
const imgEasy = "./assets/player-easy.png";
const imgMedium = "./assets/player-medium.png";
const imgHard = "./assets/player-hard.png";

type Diff = "easy" | "medium" | "hard";
const DIFFS: Record<Diff, { name: string; img: string; tag: string; label: string; hit: number; wind: number; ai: number }> = {
  easy: { name: "Ekonom-Erik", img: imgEasy, tag: "Ekonom – räknar mer än han träffar", label: "Lätt", hit: 1.35, wind: 0, ai: 0.11 },
  medium: { name: "VOX-Ville", img: imgMedium, tag: "VOXare – stabil och farlig", label: "Medel", hit: 1.0, wind: 0.04, ai: 0.065 },
  hard: { name: "Ingenjör-Kalle", img: imgHard, tag: "Ingenjör – har räknat ut kastet", label: "Svår", hit: 0.85, wind: 0.09, ai: 0.04 },
};
const L = 2.4, R = 0.045, S = 0.093;
type Cup = { x: number; y: number };
const rack = (apexY: number, dir: number): Cup[] => {
  const c: Cup[] = [];
  for (let row = 0; row < 4; row++)
    for (let i = 0; i <= row; i++) c.push({ x: (i - row / 2) * S, y: apexY + dir * row * S * 0.87 });
  return c;
};
const SLOTS = [...rack(0.3, -1), ...rack(L - 0.3, 1)];
type Ball = { sx: number; sy: number; tx: number; ty: number; t: number; dur: number; byPlayer: boolean };

export function BeerPong() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Diff | null>(null);
  const [msg, setMsg] = useState("Dra uppåt och släpp för att kasta");
  const [score, setScore] = useState({ you: 10, cpu: 10 });
  const st = useRef({
    mine: rack(0.3, -1), theirs: rack(L - 0.3, 1), ball: null as Ball | null,
    turn: "player" as "player" | "ai" | "over", wind: 0, drag: null as null | { x0: number; y0: number; x: number; y: number },
  });

  const newWind = (d: Diff) => (st.current.wind = (Math.random() * 2 - 1) * DIFFS[d].wind);

  const start = (d: Diff) => {
    Object.assign(st.current, { mine: rack(0.3, -1), theirs: rack(L - 0.3, 1), ball: null, turn: "player" });
    newWind(d); setDiff(d); setScore({ you: 10, cpu: 10 }); setMsg("Din tur – dra uppåt och släpp!");
  };

  useEffect(() => {
    if (!diff) return;
    const c = cv.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const css = getComputedStyle(document.documentElement);
    const col = (n: string) => css.getPropertyValue(n).trim();
    let raf = 0, last = performance.now(), throwAnim = 0;
    const opp = new Image(); opp.src = DIFFS[diff].img;
    const proj = (x: number, y: number, z = 0) => {
      const W = c.width, H = c.height, d = y / L, s = 1 - d * 0.6;
      return { X: W / 2 + x * s * W * 1.1, Y: H * 0.93 - d * H * 0.68 - z * s * H * 0.9, s };
    };
    const throwBall = (tx: number, ty: number, byPlayer: boolean) => {
      st.current.ball = { sx: 0, sy: byPlayer ? -0.15 : L + 0.2, tx, ty, t: 0, dur: 0.95, byPlayer };
    };
    const land = (b: Ball) => {
      const s = st.current, cups = b.byPlayer ? s.theirs : s.mine;
      const hr = R * (b.byPlayer ? DIFFS[diff].hit : 1);
      const i = cups.findIndex((k) => Math.hypot(k.x - b.tx, k.y - b.ty) < hr);
      st.current.ball = null;
      if (i >= 0) cups.splice(i, 1);
      setScore({ you: s.mine.length, cpu: s.theirs.length });
      if (!s.theirs.length) { s.turn = "over"; return setMsg("🏆 Du vann!"); }
      if (!s.mine.length) { s.turn = "over"; return setMsg(`💀 ${DIFFS[diff].name} vann!`); }
      if (b.byPlayer) {
        setMsg(i >= 0 ? `Träff! 🍺 ${DIFFS[diff].name} kastar…` : `Miss! ${DIFFS[diff].name} kastar…`);
        s.turn = "ai";
        setTimeout(() => {
          const t = s.mine[Math.floor(Math.random() * s.mine.length)], e = DIFFS[diff].ai;
          if (!t) return;
          const gx = () => (Math.random() + Math.random() + Math.random() - 1.5) * e * 1.4;
          throwAnim = 1; throwBall(t.x + gx(), t.y + gx(), false);
        }, 900);
      } else {
        newWind(diff); s.turn = "player";
        setMsg(i >= 0 ? `${DIFFS[diff].name} träffade! Din tur.` : `${DIFFS[diff].name} missade! Din tur.`);
      }
    };
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height }; };
    const down = (e: PointerEvent) => { if (st.current.turn !== "player" || st.current.ball) return; const p = pos(e); st.current.drag = { x0: p.x, y0: p.y, x: p.x, y: p.y }; };
    const move = (e: PointerEvent) => { const d = st.current.drag; if (d) { const p = pos(e); d.x = p.x; d.y = p.y; } };
    const up = () => {
      const d = st.current.drag; st.current.drag = null; if (!d) return;
      const dy = d.y0 - d.y; if (dy < 15) return;
      const pw = dy / c.height;
      const ty = 0.3 + pw * 4.2, tx = ((d.x - d.x0) / c.width) * 0.9 + st.current.wind * ty;
      throwBall(tx, ty, true);
    };
    c.addEventListener("pointerdown", down); window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);

    const cup = (k: Cup, color: string) => {
      const p = proj(k.x, k.y), w = R * p.s * c.width * 1.1, h = w * 1.6;
      g.fillStyle = color; g.beginPath();
      g.moveTo(p.X - w, p.Y - h); g.lineTo(p.X - w * 0.5, p.Y); g.lineTo(p.X + w * 0.5, p.Y); g.lineTo(p.X + w, p.Y - h); g.fill();
      g.strokeStyle = col("--sketch-ink"); g.lineWidth = 2; g.stroke();
      g.fillStyle = col("--cup-rim"); g.beginPath(); g.ellipse(p.X, p.Y - h, w, w * 0.4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = col("--beer"); g.beginPath(); g.ellipse(p.X, p.Y - h, w * 0.8, w * 0.3, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = col("--sketch-ink"); g.lineWidth = 1.5; g.stroke();
      g.strokeStyle = col("--cup-rim"); g.lineWidth = 1;
      g.beginPath(); g.moveTo(p.X - w * 0.58, p.Y - h * 0.65); g.lineTo(p.X + w * 0.65, p.Y - h * 0.61); g.stroke();
    };
    // hand-drawn wobble: same seed -> same jitter every frame
    const wob = (x: number, y: number, seed: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    };
    const pline = (x1: number, y1: number, x2: number, y2: number, axis: "x" | "y", seed: number, amp = 0.004) => {
      const N = 12;
      g.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        let x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
        const o = i === 0 || i === N ? 0 : wob(x, y, seed) * amp;
        if (axis === "x") x += o; else y += o;
        const p = proj(x, y);
        if (i) g.lineTo(p.X, p.Y); else g.moveTo(p.X, p.Y);
      }
      g.stroke();
    };
    const key = (k: Cup) => k.x.toFixed(3) + "_" + k.y.toFixed(3);
    const slot = (k: Cup) => {
      const p = proj(k.x, k.y), w = R * p.s * c.width * 1.1, seed = k.x * 13 + k.y * 7;
      const rx = w * 0.8, ry = w * 0.3, cy = p.Y - ry * 0.8;
      g.beginPath();
      for (let i = 0; i <= 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        const r = 1 + wob(Math.cos(a) * 9, Math.sin(a) * 9, seed) * 0.035;
        const X = p.X + Math.cos(a) * rx * r, Y = cy + Math.sin(a) * ry * r;
        if (i) g.lineTo(X, Y); else g.moveTo(X, Y);
      }
      g.closePath(); g.stroke();
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const W = c.width, H = c.height, s = st.current;
      g.fillStyle = col("--background"); g.fillRect(0, 0, W, H);
      throwAnim = Math.max(0, throwAnim - dt * 1.5);
      if (opp.complete && opp.naturalWidth) {
        const far = proj(0, L + 0.1), ow = W * 0.34, bob = Math.sin(now / 400) * 4 - Math.sin(throwAnim * Math.PI) * 30;
        g.drawImage(opp, far.X - ow / 2, far.Y - ow * 0.72 + bob, ow, ow);
      }
      const a = proj(-0.32, -0.1), b = proj(0.32, -0.1), e = proj(0.32, L + 0.1), f = proj(-0.32, L + 0.1);
      g.fillStyle = col("--table"); g.beginPath(); g.moveTo(a.X, a.Y); g.lineTo(b.X, b.Y); g.lineTo(e.X, e.Y); g.lineTo(f.X, f.Y); g.fill();
      g.strokeStyle = col("--table-grain"); g.lineWidth = 1;
      for (let i = 0; i < 24; i++) {
        const x = -0.29 + i * 0.025;
        pline(x, 0.02, x + 0.006, L, "x", i + 10, 0.007);
      }
      g.beginPath(); g.moveTo(a.X, a.Y); g.lineTo(b.X, b.Y); g.lineTo(e.X, e.Y); g.lineTo(f.X, f.Y); g.closePath();
      g.strokeStyle = col("--table-line"); g.lineWidth = 3; g.stroke();
      g.lineWidth = 2;
      pline(-0.28, -0.06, -0.28, L + 0.06, "x", 1);
      pline(0.28, -0.06, 0.28, L + 0.06, "x", 2);
      pline(0, 0.42, 0, L - 0.42, "x", 3);
      pline(-0.28, L / 2, 0.28, L / 2, "y", 4);
      pline(-0.28, 0.42, 0.28, 0.42, "y", 5);
      pline(-0.28, L - 0.42, 0.28, L - 0.42, "y", 6);
      g.strokeStyle = col("--table-mark"); g.lineWidth = 1.5;
      SLOTS.forEach(slot);
      [...s.theirs].sort((p, q) => q.y - p.y).forEach((k) => cup(k, col("--cup-cpu")));
      [...s.mine].sort((p, q) => q.y - p.y).forEach((k) => cup(k, col("--cup")));
      const occ = new Set([...s.mine, ...s.theirs].map(key));
      g.strokeStyle = col("--table-line"); g.lineWidth = 2.5;
      SLOTS.filter((k) => !occ.has(key(k))).forEach(slot);
      if (s.ball) {
        const bl = s.ball; bl.t += dt / bl.dur; const t = Math.min(1, bl.t);
        const x = bl.sx + (bl.tx - bl.sx) * t, y = bl.sy + (bl.ty - bl.sy) * t, z = 0.12 + Math.sin(t * Math.PI) * 0.35 - t * 0.07;
        const sh = proj(x, y); g.fillStyle = col("--shadow"); g.beginPath(); g.ellipse(sh.X, sh.Y, 8 * sh.s, 3 * sh.s, 0, 0, 7); g.fill();
        const p = proj(x, y, z); g.fillStyle = col("--ball"); g.beginPath(); g.arc(p.X, p.Y, 11 * p.s, 0, 7); g.fill();
        g.strokeStyle = col("--sketch-ink"); g.lineWidth = 1.5; g.stroke();
        if (bl.t >= 1) land(bl);
      }
      if (s.drag) { g.strokeStyle = col("--primary"); g.lineWidth = 4; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(s.drag.x0, s.drag.y0); g.lineTo(s.drag.x, s.drag.y); g.stroke(); g.setLineDash([]); }
      if (DIFFS[diff].wind) {
        g.fillStyle = col("--foreground"); g.font = "bold 22px 'Comic Sans MS', cursive"; g.textAlign = "center";
        const w = s.wind; g.fillText(`VIND ${w < 0 ? "←" : "→"} ${Math.abs(w * 100).toFixed(0)}`, W / 2, H - 12);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [diff]);

  if (!diff)
    return (
      <div className="opponent-picker flex flex-col items-center gap-6 text-center">
        <h1 aria-label="Beer Pong" className="game-title font-display text-5xl text-primary sm:text-7xl">
          <span aria-hidden="true" className="sketch-lettering">{"Beer Pong".split("").map((letter, i) => <span key={i}>{letter === " " ? "\u00a0" : letter}</span>)}</span>
          <svg aria-hidden="true" className="title-scribble" viewBox="0 0 400 24" fill="none"><path d="M5 11 L39 8 73 12 112 6 157 10 205 7 259 9 310 4 350 7 395 3 M18 19 L68 16 124 19 181 14 245 17 297 12 373 13" /></svg>
        </h1>
        <p className="picker-label text-foreground">Vem möter du?
          <svg aria-hidden="true" className="picker-arrow" viewBox="0 0 100 60" fill="none"><path d="M5 6 C51 -2 83 11 72 45 M58 32 L71 49 86 34 M8 10 C43 3 78 14 74 38" /></svg>
        </p>
        <div className="grid w-full gap-6 sm:grid-cols-3">
          {(Object.keys(DIFFS) as Diff[]).map((d) => (
            <Button variant="ghost" key={d} onClick={() => start(d)} className="opponent-card h-auto px-5 pb-8 pt-5 whitespace-normal [&_.sketch-frame]:h-full [&_.sketch-frame]:w-full">
              <svg aria-hidden="true" className="sketch-frame" viewBox="0 0 240 400" preserveAspectRatio="none" fill="none"><path d="M8 12 L65 8 112 11 167 6 230 12 233 89 229 159 234 235 231 307 234 387 163 391 104 387 47 394 9 389 6 308 10 241 5 171 9 96 Z" /><path d="M13 17 L75 14 129 17 181 12 225 17 M226 24 L228 113 224 182 M229 256 L225 320 228 382 159 385 87 382 16 386 M14 377 L12 306 15 247" /></svg>
              <img src={DIFFS[d].img} alt={DIFFS[d].name} width={816} height={816} className="aspect-square w-full object-contain object-top" />
              <span className="font-display text-xl text-primary">{DIFFS[d].name}</span>
              <span className="difficulty-scrawl font-display text-sm font-semibold">{DIFFS[d].label}</span>
              <span className="text-xs text-muted-foreground">{DIFFS[d].tag}</span>
            </Button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <div className="scoreboard flex w-full flex-wrap items-center justify-between gap-2 font-display text-base sm:text-lg">
        <span className="text-primary">Du: {score.you}</span>
        <span className="flex items-center gap-2 text-muted-foreground"><img src={DIFFS[diff].img} alt="" className="h-10 w-10 rounded-full object-cover object-top" />{DIFFS[diff].name}</span>
        <span className="text-destructive">{DIFFS[diff].name.split(" ")[0]}: {score.cpu}</span>
      </div>
      <canvas aria-label="Beer pong-bord" ref={cv} width={600} height={800} className="game-board w-full touch-none" />
      <p className="text-center font-medium">{msg}</p>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => start(diff)} className="btn-game-sm">Starta om</Button>
        <Button variant="ghost" onClick={() => setDiff(null)} className="btn-game-sm">Byt nivå</Button>
      </div>
    </div>
  );
}
