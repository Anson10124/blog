"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Opacity across one splat triangle, from its barycentric coordinates b0, b1, b2.
 *   Apple (read from the same-build fragment shader):
 *     alpha = min(0.99, P · col0 · (b0·b1·b2)^C), with P = 28 and C = 1.5 from the tile header
 *   Soft tri (my viewer's default, a hypothesis chosen by eye):
 *     alpha = col0 · clamp(3 · min(b0, b1, b2), 0, 1)
 * "Boost" multiplies P, to explore how far Apple's formula is from what Maps shows.
 */
const SIZE = 220;
const COLOUR = [62, 122, 58];

function alphaApple(b0: number, b1: number, b2: number, col0: number, boost: number) {
  return Math.min(0.99, 28 * boost * col0 * Math.pow(b0 * b1 * b2, 1.5));
}
function alphaSoft(b0: number, b1: number, b2: number, col0: number) {
  return col0 * Math.min(1, Math.max(0, 3 * Math.min(b0, b1, b2)));
}

function draw(canvas: HTMLCanvasElement, f: (b0: number, b1: number, b2: number) => number) {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const n = Math.round(SIZE * scale);
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(n, n);
  // Triangle corners (pixels): top middle, bottom left, bottom right.
  const ax = n / 2, ay = n * 0.08, bx = n * 0.04, by = n * 0.86, cx = n * 0.96, cy = n * 0.86;
  const det = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const b0 = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / det;
      const b1 = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / det;
      const b2 = 1 - b0 - b1;
      if (b0 < 0 || b1 < 0 || b2 < 0) continue;
      const a = f(b0, b1, b2);
      const i = (y * n + x) * 4;
      image.data[i] = COLOUR[0];
      image.data[i + 1] = COLOUR[1];
      image.data[i + 2] = COLOUR[2];
      image.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  // Outline, so a nearly transparent splat still shows where it is.
  ctx.strokeStyle = "rgba(128,128,128,0.6)";
  ctx.lineWidth = scale;
  ctx.setLineDash([4 * scale, 4 * scale]);
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.stroke();
}

export function Footprint() {
  const [col0, setCol0] = useState(0.6);
  const [boostLog, setBoostLog] = useState(0); // log2 of the boost, 0..5
  const boost = 2 ** boostLog;
  const apple = useRef<HTMLCanvasElement>(null);
  const soft = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (apple.current) draw(apple.current, (a, b, c) => alphaApple(a, b, c, col0, boost));
    if (soft.current) draw(soft.current, (a, b, c) => alphaSoft(a, b, c, col0));
  }, [col0, boost]);

  const third = 1 / 3;
  const appleCentre = alphaApple(third, third, third, col0, boost);
  const softCentre = alphaSoft(third, third, third, col0);

  const panel = (title: string, label: string, ref: React.RefObject<HTMLCanvasElement | null>, centre: number) => (
    <figure className="flex flex-col items-center">
      <div
        className="rounded-md border border-rule p-2"
        style={{
          backgroundImage:
            "linear-gradient(45deg, var(--rule) 25%, transparent 25%, transparent 75%, var(--rule) 75%), linear-gradient(45deg, var(--rule) 25%, transparent 25%, transparent 75%, var(--rule) 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 8px 8px",
        }}
      >
        <canvas ref={ref} style={{ width: SIZE, height: SIZE }} className="block max-w-full" aria-label={`${title} opacity map`} />
      </div>
      <figcaption className="mt-3 text-center">
        <span className="font-display text-xl">{title}</span>
        <span className="label block text-muted">{label}</span>
        <span className="label mt-1 block">
          centre opacity <span className="text-accent tabular-nums">{centre.toFixed(2)}</span>
        </span>
      </figcaption>
    </figure>
  );

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {panel("Apple's formula", "read from the shader", apple, appleCentre)}
        {panel("Soft tri?", "my viewer's default, a hypothesis", soft, softCentre)}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label flex justify-between text-muted">
            <span>col 0 (per-splat opacity)</span>
            <span className="tabular-nums text-ink">{col0.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0.04}
            max={1}
            step={0.04}
            value={col0}
            onChange={(e) => setCol0(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="label flex justify-between text-muted">
            <span>boost on Apple&rsquo;s 28</span>
            <span className="tabular-nums text-ink">{boost < 10 ? boost.toFixed(1) : boost.toFixed(0)}×</span>
          </span>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={boostLog}
            onChange={(e) => setBoostLog(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>
      </div>
    </div>
  );
}
