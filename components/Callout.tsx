import type { ReactNode } from "react";

type CalloutProps = {
  /** Small label above the text, e.g. "Note" or "Aside". */
  label?: string;
  children: ReactNode;
};

/** A side note that stands apart from the main text. */
export function Callout({ label = "Note", children }: CalloutProps) {
  return (
    <aside className="border-l-2 border-accent py-1 pl-5">
      <p className="mb-1 text-accent">{label}</p>
      <div className="text-[0.975rem] leading-relaxed [&>*+*]:mt-3">
        {children}
      </div>
    </aside>
  );
}
