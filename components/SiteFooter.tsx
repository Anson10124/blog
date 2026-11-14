import { site } from "@/site.config";

export function SiteFooter() {
  return (
    <footer className="font-display mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8 text-muted">
      <p>
        {site.name} by {site.author}
      </p>
      <p>
        See you next year
      </p>
    </footer>
  );
}
