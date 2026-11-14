"use client";

import { useState } from "react";

/*
 * How one plane turns a short list of events into one value per row.
 * A flag frame holds one bit per row after the first (least significant bit
 * first). Row 0 takes the first event; a 1 flag takes the next event; a 0 flag
 * repeats (kind 4) or looks up a cache keyed by the previous value (kind 5).
 * So the number of events is always popcount(flags) + 1.
 * The values are made up; the rules are the ones the decoder implements.
 */
const ROWS = 12;
const EVENT_POOL = [7, 3, 7, 9, 3, 5, 9, 2, 7, 4, 1, 8];

function expand(flags: boolean[], kind: 4 | 5) {
  const events = EVENT_POOL.slice(0, 1 + flags.filter(Boolean).length);
  const out = [events[0]];
  const source: ("event" | "repeat" | "cache")[] = ["event"];
  const cache = new Map<number, number>();
  let next = 1;
  for (const flag of flags) {
    const previous = out[out.length - 1];
    if (flag) {
      const value = events[next++];
      if (kind === 5) cache.set(previous, value);
      out.push(value);
      source.push("event");
    } else {
      out.push(kind === 4 ? previous : (cache.get(previous) ?? 0));
      source.push(kind === 4 ? "repeat" : "cache");
    }
  }
  return { events, out, source };
}

export function EventPlane() {
  const [flags, setFlags] = useState<boolean[]>([false, true, false, false, true, true, false, false, true, false, false]);
  const [kind, setKind] = useState<4 | 5>(4);
  const { events, out, source } = expand(flags, kind);

  return (
    <div>
      <div role="radiogroup" aria-label="Plane kind" className="mb-6 flex flex-wrap gap-2">
        {(
          [
            [4, "Kind 4 · repeat"],
            [5, "Kind 5 · transition cache"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={k === kind}
            onClick={() => setKind(k)}
            className={`label rounded-full border px-3.5 py-1.5 transition-colors ${
              k === kind ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center tabular-nums text-sm">
          <tbody>
            <tr>
              <th className="label pr-2 text-left font-normal text-muted">row</th>
              {Array.from({ length: ROWS }, (_, i) => (
                <td key={i} className="text-muted">
                  {i}
                </td>
              ))}
            </tr>
            <tr>
              <th className="label pr-2 text-left font-normal text-muted">flag</th>
              <td className="text-muted">–</td>
              {flags.map((f, i) => (
                <td key={i}>
                  <button
                    type="button"
                    aria-label={`Flag for row ${i + 1}: ${f ? 1 : 0}`}
                    aria-pressed={f}
                    onClick={() => setFlags(flags.map((x, j) => (j === i ? !x : x)))}
                    className={`h-9 w-full rounded border transition-colors ${
                      f ? "border-accent bg-accent text-paper" : "border-rule bg-paper text-muted hover:border-ink"
                    }`}
                  >
                    {f ? 1 : 0}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              <th className="label pr-2 text-left font-normal text-muted">value</th>
              {out.map((v, i) => (
                <td
                  key={i}
                  className={`h-9 rounded ${
                    source[i] === "event" ? "bg-ink text-paper" : source[i] === "cache" ? "bg-accent/25" : "bg-rule/50"
                  }`}
                >
                  {v}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed">
        Events needed: <span className="tabular-nums">{flags.filter(Boolean).length}</span> flags set + 1 ={" "}
        <span className="tabular-nums text-accent">{events.length}</span>{" "}
        <span className="text-muted">({events.join(", ")})</span>
      </p>
      <p className="mt-1 text-sm text-muted">
        Click the flags. Solid cells take a new event.{" "}
        {kind === 4
          ? "Faded cells repeat the value before them."
          : "Tinted cells look up what followed the previous value the last time that value was followed by an event (0 if never)."}
      </p>
    </div>
  );
}
