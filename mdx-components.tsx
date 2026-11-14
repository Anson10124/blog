import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Demo } from "@/components/Demo";

/**
 * Components available in every .mdx file without importing them.
 * Plain markdown elements (headings, paragraphs, lists, code…) are styled
 * by the `.prose` rules in app/globals.css.
 */
const components: MDXComponents = {
  // Internal links use the Next.js router; external links open in a new tab.
  a: ({ href = "", children, ...props }) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  Callout,
  Demo,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
