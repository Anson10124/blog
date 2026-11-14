import Link from "next/link";
import { site } from "@/site.config";

export function SiteHeader() {
  return (
    <header className="flex items-baseline justify-between gap-6 py-6">
      <Link
        href="/"
        className="font-display text-2xl leading-none transition-colors hover:text-accent"
      >
        {site.author}&apos;s {site.name}
      </Link>

      <nav aria-label="Site font-display">
        <ul className="flex gap-5 text-muted">
          {site.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-insightflare-event="outbound_link_click"
                data-insightflare-event-label={link.label}
                data-insightflare-event-location="header"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/rss.xml"
              data-insightflare-event="rss_click"
              data-insightflare-event-location="header"
              className="font-display transition-colors hover:text-ink"
            >
              RSS
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
