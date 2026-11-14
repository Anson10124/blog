"use client";

import { useState } from "react";

type Item = {
  /** Button label. */
  label: string;
  src: string;
  alt: string;
  /** One line shown under the picture for this item. */
  note?: string;
};

/**
 * Several pictures of the same view, one at a time, with buttons to switch.
 * All pictures are rendered up front (stacked) so switching is instant and
 * the frame never changes height.
 */
export function ImageTabs({
  items,
  ratio = "16 / 9",
  initial = items.length - 1,
}: {
  items: Item[];
  ratio?: string;
  /** Which picture shows first (default: the last one). */
  initial?: number;
}) {
  const [index, setIndex] = useState(initial);

  return (
    <div>
      <div role="tablist" aria-label="Picture" className="mb-4 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`label rounded-full border px-3.5 py-1.5 transition-colors ${
              i === index
                ? "border-ink bg-ink text-paper"
                : "border-rule text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-md bg-paper" style={{ aspectRatio: ratio }}>
        {items.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            aria-hidden={i !== index}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {items[index].note ? (
        <p className="mt-3 min-h-[3em] text-sm leading-relaxed text-muted">{items[index].note}</p>
      ) : null}
    </div>
  );
}
