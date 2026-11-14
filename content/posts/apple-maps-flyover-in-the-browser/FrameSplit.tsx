"use client";

import { useState } from "react";

/*
 * One compressed frame, drawn as a strip of 4-byte cells. The byte values are
 * made up; the layout is the one the format uses. Two readings of the same
 * bytes: the early scanner's "A/B" slices, and the frame as the native code
 * reads it.
 */
type Cell = { text: string; kind: "marker" | "len" | "core" | "table" | "data" | "next" };

const CELLS: Cell[] = [
  { text: "00 00 00 24", kind: "marker" },
  { text: "L0 (u32)", kind: "len" },
  { text: "L1 (u64)", kind: "len" },
  { text: "· · ·", kind: "len" },
  { text: "02 00 00 61", kind: "core" },
  { text: "table", kind: "table" },
  { text: "table", kind: "table" },
  { text: "table", kind: "table" },
  { text: "data", kind: "data" },
  { text: "data", kind: "data" },
  { text: "data", kind: "data" },
  { text: "data", kind: "data" },
  { text: "count · len", kind: "next" },
  { text: "next frame", kind: "next" },
];

// Cell index ranges [start, end) of the named slices, per reading.
const READINGS = {
  scanner: {
    title: "Early reading (scanner)",
    slices: [
      { name: "A", from: 5, to: 9, note: "A_len bytes from offset 20" },
      { name: "B core", from: 9, to: 12, note: "B_len bytes, minus…" },
      { name: "W, H", from: 12, to: 13, note: "…a 4-byte 'footer'" },
    ],
    text:
      "The scanner started A at offset 20. So A ran four bytes into the Huffman data, B started four bytes late and ran four bytes past the end of the frame, and B's last four bytes looked like a footer holding a width and a height.",
  },
  native: {
    title: "Native reading",
    slices: [
      { name: "region 1 (L0)", from: 4, to: 8, note: "core marker + packed table" },
      { name: "region 2 (L1)", from: 8, to: 12, note: "Huffman data" },
      { name: "next plane", from: 12, to: 14, note: "event count, frame length" },
    ],
    text:
      "L0 counts the 4-byte core marker too, so region 1 starts at offset 16, not 20. The 'W' and 'H' footer is not part of this frame at all: it is the start of the next plane, two size integers giving its event count and its first frame's byte length.",
  },
} as const;

const tone: Record<Cell["kind"], string> = {
  marker: "bg-ink text-paper",
  len: "bg-rule text-ink",
  core: "bg-ink/80 text-paper",
  table: "bg-accent/25 text-ink",
  data: "bg-accent/55 text-ink",
  next: "bg-surface text-muted border border-dashed border-rule",
};

export function FrameSplit() {
  const [mode, setMode] = useState<keyof typeof READINGS>("scanner");
  const reading = READINGS[mode];

  return (
    <div>
      <div role="radiogroup" aria-label="Reading" className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(READINGS) as (keyof typeof READINGS)[]).map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={key === mode}
            onClick={() => setMode(key)}
            className={`label rounded-full border px-3.5 py-1.5 transition-colors ${
              key === mode ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {READINGS[key].title}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-14 gap-px" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
            {CELLS.map((cell, i) => (
              <div
                key={i}
                className={`flex h-12 items-center justify-center rounded-[3px] px-0.5 text-center tabular-nums text-[0.62rem] leading-tight ${tone[cell.kind]}`}
              >
                {cell.text}
              </div>
            ))}
          </div>
          <div className="label mt-1 grid text-muted" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
            {CELLS.map((_, i) => (
              <span key={i} className="text-center">
                {i % 2 === 0 ? `+${i * 4}` : ""}
              </span>
            ))}
          </div>

          <div className="relative mt-3 h-20">
            {reading.slices.map((s) => (
              <div
                key={s.name}
                className="absolute top-0 transition-all duration-500"
                style={{ left: `${(s.from / 14) * 100}%`, width: `${((s.to - s.from) / 14) * 100}%` }}
              >
                <div className="h-2 rounded-b border-x-2 border-b-2 border-accent" />
                <p className="mt-1 text-center font-display text-lg leading-none">{s.name}</p>
                <p className="mt-1 text-center text-[0.7rem] leading-snug text-muted">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-2 min-h-[4.5em] text-[0.95rem] leading-relaxed">{reading.text}</p>
    </div>
  );
}
