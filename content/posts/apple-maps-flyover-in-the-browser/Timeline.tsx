"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * The project's history, from its experiment log. "Splat" and "mesh" are how
 * many of the 41 decoder inputs had that section decoded by general code
 * (not by a model fitted to one sample) at that point.
 */
type Step = {
  date: string;
  title: string;
  text: string;
  splat: number;
  mesh: number;
  dead?: boolean; // a direction that was later abandoned
};

const STEPS: Step[] = [
  {
    date: "Sep 19",
    title: "Ten tiles and a hex viewer",
    text: "Ten neighbouring London tiles. A scanner finds records that start 00 00 00 24 and contain 02 00 00 61, in a repeating group of nine. I name the two payloads A and B, and the oddly framed ones E1.",
    splat: 0,
    mesh: 0,
  },
  {
    date: "Sep 21",
    title: "Six bits",
    text: "One B stream is exactly 3,168 × 6 bits long and uses all 64 six-bit values. That looks like a code. It is not: no shared six-bit or escape model gives a single exact hit.",
    splat: 0,
    mesh: 0,
    dead: true,
  },
  {
    date: "Sep 24",
    title: "The sparse grid that wasn't",
    text: "B ends in two small numbers I call W and H, so B must be a sparse W × H occupancy grid. Rice, Golomb, Elias, run lengths, static, adaptive and spatial-context arithmetic coding: zero exact fits, across thousands of variants. The same day, a real anchor: the header is the tile centre in Earth-centred coordinates, to within 2.3 nanometres.",
    splat: 0,
    mesh: 0,
    dead: true,
  },
  {
    date: "Sep 25–27",
    title: "Going native",
    text: "Stop guessing from bytes. Follow the exact-build VectorKit to the reader that turns a tile into splats, and capture one real reader input and both of its output arrays on my Mac: a ground truth to aim at.",
    splat: 0,
    mesh: 0,
  },
  {
    date: "Oct 6",
    title: "The Huffman bridge",
    text: "Port the native Huffman grammar. 108 of 108 streams re-encode byte for byte. The A/B split was four bytes late, A is a packed Huffman table with 101 or 102 entries, and W/H belongs to the next plane. Every earlier model is retired at once.",
    splat: 0,
    mesh: 0,
  },
  {
    date: "Oct 10",
    title: "Plane by plane",
    text: "Port the plane kinds one at a time: repeats, transition caches, deltas, selectors. Both saved arrays for the one captured sample are reproduced exactly, but by sample-specific code.",
    splat: 0,
    mesh: 0,
  },
  {
    date: "Nov 8",
    title: "One decoder for every tile",
    text: "Remove the single-sample gates and keep every structural check. 20 inputs decode, then 22, then 39. Axes, placement, the splat primitive and normals get names, each tied to a test. The first viewer.",
    splat: 39,
    mesh: 0,
  },
  {
    date: "Nov 9",
    title: "The other three quarters",
    text: "The last splat tile decodes. The shaders are read. The bytes after the splats, which I had treated as side data, turn out to be a whole section: a compressed textured mesh plus its three HEIF images. Apple's own reader is run on all 41 inputs: splats byte-exact on all 40 that have them. The mesh decoder is ported the same day: 41 of 41.",
    splat: 40,
    mesh: 41,
  },
  {
    date: "Nov 10–12",
    title: "Thousands of tiles",
    text: "A Rust port, identical to the Python reference. Thousands of further tiles, multi-material meshes at zoom 13, and decoding inside the browser. None of these extra tiles has Apple output to compare with.",
    splat: 40,
    mesh: 41,
  },
];

export function Timeline() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[40rem]">
          {/* One continuous track from the first dot to the last (half a column in from each edge) */}
          <span
            aria-hidden
            className="absolute top-[0.4375rem] h-px bg-rule"
            style={{ left: `${50 / STEPS.length}%`, right: `${50 / STEPS.length}%` }}
          />
          <ol
            className="relative m-0! grid list-none! p-0!"
            style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}
            aria-label="Milestones"
          >
            {STEPS.map((s, i) => (
              <li key={s.date} className="mt-0!">
                <button
                  type="button"
                  aria-label={`${s.date}: ${s.title}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className="group flex w-full flex-col items-center"
                >
                  <span
                    className={`size-3.5 rounded-full border-2 transition-colors ${
                      i === index
                        ? "border-accent bg-accent"
                        : s.dead
                          ? "border-muted bg-paper group-hover:border-ink"
                          : "border-ink bg-ink/80 group-hover:bg-ink"
                    }`}
                  />
                  <span className={`label mt-2 whitespace-nowrap ${i === index ? "text-accent" : "text-muted"}`}>
                    {s.date}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 min-h-[12rem]">
        <p className="font-display text-3xl leading-tight">
          {step.title}
          {step.dead ? <span className="label ml-3 align-middle text-muted">dead end</span> : null}
        </p>
        <p className="mt-3 text-[0.975rem] leading-relaxed">{step.text}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["Splat sections decoded", step.splat],
            ["Mesh sections decoded", step.mesh],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <p className="label flex justify-between text-muted">
              <span>{label}</span>
              <span className="tabular-nums text-ink">{value} / 41</span>
            </p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-rule/60">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(value / 41) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="label rounded-full border border-rule px-3.5 py-1.5 text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40 flex items-center"
        >
          <ChevronLeft className="size-4"/>
        </button>
        <button
          type="button"
          onClick={() => setIndex(Math.min(STEPS.length - 1, index + 1))}
          disabled={index === STEPS.length - 1}
          className="label rounded-full border border-rule px-3.5 py-1.5 text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40 flex items-center"
        >
          <ChevronRight className="size-4"/>
        </button>
      </div>
    </div>
  );
}
