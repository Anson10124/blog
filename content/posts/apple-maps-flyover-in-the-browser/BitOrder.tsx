"use client";

import { useMemo, useState } from "react";

/*
 * A toy prefix code and a toy message, packed the way the format packs its
 * Huffman data: bits go into 32-bit words most significant bit first, and
 * each word is stored little-endian. Nothing here is Apple data.
 */
const CODE: Record<string, string> = { A: "0", B: "10", C: "110", D: "111" };
const MESSAGE = "BADCABDABBADCABAACABBADDCABDAA";

function pack(message: string): number[] {
  let bits = message.split("").map((s) => CODE[s]).join("");
  bits = bits.padEnd(Math.ceil(bits.length / 32) * 32, "0");
  const bytes: number[] = [];
  for (let w = 0; w < bits.length; w += 32) {
    const word = parseInt(bits.slice(w, w + 32), 2);
    for (let k = 0; k < 4; k++) bytes.push(Math.floor(word / 2 ** (8 * k)) & 0xff); // little-endian
  }
  return bytes;
}

function readBits(bytes: number[], mode: "file" | "word"): string {
  if (mode === "file") return bytes.map((b) => b.toString(2).padStart(8, "0")).join("");
  let out = "";
  for (let i = 0; i < bytes.length; i += 4) {
    const word = bytes[i] + bytes[i + 1] * 2 ** 8 + bytes[i + 2] * 2 ** 16 + bytes[i + 3] * 2 ** 24;
    out += word.toString(2).padStart(32, "0");
  }
  return out;
}

function decode(bits: string): { symbol: string; start: number; end: number }[] {
  const reverse = Object.fromEntries(Object.entries(CODE).map(([s, c]) => [c, s]));
  const out: { symbol: string; start: number; end: number }[] = [];
  let start = 0;
  for (let i = 1; i <= bits.length; i++) {
    const symbol = reverse[bits.slice(start, i)];
    if (symbol) {
      out.push({ symbol, start, end: i });
      start = i;
    }
  }
  return out;
}

const COLOURS: Record<string, string> = {
  A: "bg-accent/20",
  B: "bg-accent/45",
  C: "bg-ink/15",
  D: "bg-ink/30",
};

export function BitOrder() {
  const bytes = useMemo(() => pack(MESSAGE), []);
  const [mode, setMode] = useState<"file" | "word">("file");
  const bits = readBits(bytes, mode);
  const symbols = decode(bits);
  const decoded = symbols.map((s) => s.symbol).join("");
  const correct = decoded.startsWith(MESSAGE);

  return (
    <div>
      <p className="label text-muted">The bytes as stored</p>
      <div className="mt-2 flex flex-wrap gap-1.5 tabular-nums text-sm">
        {bytes.map((b, i) => (
          <span
            key={i}
            className={`rounded px-1.5 py-1 ${i % 8 < 4 ? "bg-rule/60" : "bg-rule/25"} ${i % 4 === 3 ? "mr-2" : ""}`}
          >
            {b.toString(16).padStart(2, "0")}
          </span>
        ))}
      </div>

      <div role="radiogroup" aria-label="Bit order" className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["file", "Byte by byte, MSB first"],
            ["word", "LE u32 words, MSB first"],
          ] as const
        ).map(([key, label]) => (
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
            {label}
          </button>
        ))}
      </div>

      <p className="label mt-6 text-muted">The bit stream, cut by the code A=0 B=10 C=110 D=111</p>
      <div className="mt-2 flex flex-wrap gap-y-1.5 tabular-nums text-[0.8rem] leading-none">
        {symbols.map((s, i) => (
          <span key={i} className={`mr-0.5 rounded-[3px] px-1 py-1 ${COLOURS[s.symbol]}`} title={s.symbol}>
            {bits.slice(s.start, s.end)}
          </span>
        ))}
      </div>

      <p className="label mt-6 text-muted">Decoded</p>
      <p className={`mt-1 break-all tabular-nums text-lg ${correct ? "text-ink" : "text-accent"}`}>{decoded}</p>
      <p className="mt-2 text-sm text-muted">
        {correct
          ? "Right order: the message comes back, followed by padding (the trailing As are zero bits)."
          : "Wrong order: it still decodes to something, because every bit string can be cut by a complete code. Only an exact re-encode or an independent count shows that it is wrong."}
      </p>
    </div>
  );
}
