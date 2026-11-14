"use client";

import { useState } from "react";

/*
 * Byte shares measured on the 41 decoder inputs (40 supplied tiles plus one
 * captured reader input). "Example" is one Brooklyn tile (637,429 bytes) whose
 * mesh share is the median of the 41. Ranges are min-max over the 41.
 */
type Part = {
  key: string;
  label: string;
  share: number; // % of the example file
  tone: string; // tailwind background class
  ink: string; // label colour on that background
  range: string;
  fields: string[];
};

const PARTS: Part[] = [
  {
    key: "splats",
    label: "Section 1 · splats",
    share: 23.4,
    tone: "bg-accent",
    ink: "text-paper",
    range: "4–61% of a file",
    fields: [
      "Field 1 (106 bytes): the tile frame, a rotation and an Earth-centred position",
      "Field 4 (24 bytes): a light candidate (meaning not confirmed)",
      "Field 2 (16 bytes): unknown",
      "Field 3: the splat producer, two compressed components: positions and attributes",
    ],
  },
  {
    key: "trico",
    label: "Section 2 · compressed mesh",
    share: 23.0,
    tone: "bg-ink",
    ink: "text-paper",
    range: "3–53% of a file",
    fields: [
      "Field 1 (152 bytes): the same frame again, plus 7 doubles of unknown meaning",
      "Field 2: the mesh itself, in the input format of VectorKit's _trico_mesh_decompress",
    ],
  },
  {
    key: "colour",
    label: "Section 2 · colour atlas",
    share: 29.4,
    tone: "bg-muted",
    ink: "text-paper",
    range: "17–50% of a file",
    fields: ["A complete HEIF image (RGB) that the mesh's UVs point into"],
  },
  {
    key: "maps",
    label: "Section 2 · two grey maps",
    share: 24.2,
    tone: "bg-rule",
    ink: "text-ink",
    range: "about 11–32% of a file",
    fields: [
      "Two more HEIF images at half size, one channel each",
      "Most likely specular and roughness; unless a debug setting is on, VectorKit drops them before drawing",
    ],
  },
];

export function FileAnatomy() {
  const [active, setActive] = useState("splats");
  const part = PARTS.find((p) => p.key === active)!;

  return (
    <div>
      <div className="flex h-14 w-full overflow-hidden rounded-md border border-rule" role="group" aria-label="File parts">
        {PARTS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-label={`${p.label}: ${p.share}%`}
            aria-pressed={p.key === active}
            onClick={() => setActive(p.key)}
            onMouseEnter={() => setActive(p.key)}
            style={{ width: `${p.share}%` }}
            className={`${p.tone} relative transition-opacity ${
              p.key === active ? "opacity-100" : "opacity-55 hover:opacity-80"
            }`}
          >
            <span className={`label absolute inset-0 flex items-center justify-center ${p.ink}`}>
              {Math.round(p.share)}%
            </span>
          </button>
        ))}
        {/* Section 3 and the file header: a few bytes, drawn as a hairline so they exist. */}
        <span className="w-px shrink-0 bg-accent" title="Section 3: 4 bytes, no fields" />
      </div>

      <div className="label mt-2 flex justify-between text-muted">
        <span>byte 0</span>
        <span>637,429 bytes</span>
      </div>

      <div className="mt-6 min-h-[9.5rem]">
        <p className="font-display text-2xl leading-tight">{part.label}</p>
        <p className="label mt-1 text-accent">
          {part.share}% here · {part.range} across the 41 inputs
        </p>
        <ul className="mt-3 space-y-1.5 text-[0.95rem] leading-relaxed">
          {part.fields.map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 border-t border-rule pt-3 text-sm text-muted">
        Section 3 is always 4 bytes with no fields. The file header before the
        sections is under 0.5% of any file.
      </p>
    </div>
  );
}
