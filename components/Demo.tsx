import type { ReactNode } from "react";

type DemoProps = {
  /** Small label in the top-left corner of the frame. */
  title?: string;
  /** Explanatory text shown underneath. */
  caption?: ReactNode;
  children: ReactNode;
};

/**
 * A frame for interactive elements inside a post. It is slightly wider than
 * the text column on large screens so demos have room to breathe.
 *
 *   <Demo title="Try it" caption="Drag the slider.">
 *     <MyWidget />
 *   </Demo>
 */
export function Demo({ title, caption, children }: DemoProps) {
  return (
    <figure className="my-10 sm:-mx-6">
      <div className="overflow-hidden rounded-lg border border-rule bg-surface">
        <div className="label flex items-center gap-2 border-b border-rule sm:px-6 py-2.5 text-muted">
          {title ?? "Interactive"}
        </div>
        <div className="p-5 sm:p-7">{children}</div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted sm:px-6">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
