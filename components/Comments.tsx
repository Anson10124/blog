"use client";

import { useEffect, useRef } from "react";
import { site } from "@/site.config";

/**
 * giscus comments. Each post gets its own GitHub Discussion, matched by the
 * post's URL path, so a discussion is created automatically the first time
 * somebody comments.
 */
export function Comments() {
  const container = useRef<HTMLDivElement>(null);
  const { repo, repoId, category, categoryId } = site.giscus;
  const configured = Boolean(repo && repoId && categoryId);

  useEffect(() => {
    const el = container.current;
    if (!configured || !el) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // giscus fetches the theme stylesheet itself, so it needs a full URL.
    // Browsers stop giscus.app from loading files off localhost, so local dev
    // borrows the copy on the live site instead.
    const isLocal = ["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    );
    const themeOrigin = isLocal ? site.url : window.location.origin;

    const options: Record<string, string> = {
      "data-repo": repo,
      "data-repo-id": repoId,
      "data-category": category,
      "data-category-id": categoryId,
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      // The site's own colours (light and dark), from public/giscus.css.
      "data-theme": `${themeOrigin}/giscus.css`,
      "data-lang": "en",
      "data-loading": "lazy",
    };
    for (const [name, value] of Object.entries(options)) {
      script.setAttribute(name, value);
    }

    el.appendChild(script);
    return () => el.replaceChildren();
  }, [configured, repo, repoId, category, categoryId]);

  return (
    <section aria-labelledby="comments-heading" className="mt-24">
      {configured ? (
        <div ref={container} className="giscus" />
      ) : (
        <p className="rounded-lg border border-dashed border-rule p-5 text-sm leading-relaxed text-muted">
          Comments are not switched on yet. Follow the three steps in{" "}
          <code className="font-mono text-ink">site.config.ts</code> to connect
          giscus, and they will appear here.
        </p>
      )}
    </section>
  );
}
