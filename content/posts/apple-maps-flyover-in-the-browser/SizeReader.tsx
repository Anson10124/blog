"use client";

import { useState } from "react";

/*
 * The format's variable-length size integer, as the native reader decodes it:
 * n = 1 + the number of trailing one bits of the first (control) byte; read n
 * little-endian bytes starting with the control byte; shift right by n.
 * A control byte of FF instead means "the next 8 bytes are a u64".
 */
const PRESETS: { label: string; bytes: number[] }[] = [
  { label: "d3 7e 03", bytes: [0xd3, 0x7e, 0x03] },
  { label: "2a", bytes: [0x2a] },
  { label: "a5 04", bytes: [0xa5, 0x04] },
  { label: "57 3c 9e 01", bytes: [0x57, 0x3c, 0x9e, 0x01] },
];

function trailingOnes(b: number) {
  let n = 0;
  while (n < 8 && (b >> n) & 1) n++;
  return n;
}

const hex = (b: number) => b.toString(16).padStart(2, "0");
const bin = (b: number) => b.toString(2).padStart(8, "0");

export function SizeReader() {
  const [preset, setPreset] = useState(0);
  const bytes = PRESETS[preset].bytes;
  const control = bytes[0];
  const ones = trailingOnes(control);
  const n = ones + 1;
  const used = bytes.slice(0, n);
  const raw = used.reduce((acc, b, i) => acc + b * 2 ** (8 * i), 0);
  const value = Math.floor(raw / 2 ** n);

  return (
    <div>
      <div role="radiogroup" aria-label="Example bytes" className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            role="radio"
            aria-checked={i === preset}
            onClick={() => setPreset(i)}
            className={`rounded-full border px-3.5 py-1.5 tabular-nums text-sm transition-colors ${
              i === preset ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-5 text-[0.95rem] leading-relaxed">
        <div>
          <p className="label text-muted">1 · Control byte</p>
          <p className="mt-1 tabular-nums text-lg">
            {hex(control)} ={" "}
            {bin(control)
              .split("")
              .map((bit, i) => (
                <span key={i} className={i >= 8 - ones ? "text-accent" : i === 7 - ones ? "underline decoration-accent" : ""}>
                  {bit}
                </span>
              ))}
          </p>
          <p className="text-muted">
            {ones} trailing one bit{ones === 1 ? "" : "s"}, so the integer is n = {n} byte{n === 1 ? "" : "s"} long.
          </p>
        </div>
        <div>
          <p className="label text-muted">2 · Read {n} little-endian byte{n === 1 ? "" : "s"}</p>
          <p className="mt-1 tabular-nums text-lg">
            0x{used.slice().reverse().map(hex).join("")} = {raw.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <p className="label text-muted">3 · Shift right by {n}</p>
          <p className="mt-1 font-display text-4xl leading-none text-accent tabular-nums">
            {value.toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
}
