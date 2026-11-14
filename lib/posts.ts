import type { ComponentType } from "react";

/**
 * What every post.mdx must export:
 *
 *   export const metadata = {
 *     title: "…",
 *     date: "2026-11-12",
 *     description: "…",
 *   };
 */
export type PostMeta = {
  title: string;
  /** ISO date, e.g. "2026-11-12". */
  date: string;
  description: string;
  /** Set to true to hide a post from the site while you are writing it. */
  draft?: boolean;
};

export type Post = PostMeta & {
  /** The folder name under content/posts, used as the URL. */
  slug: string;
  year: number;
  Content: ComponentType;
};

type PostModule = { default: ComponentType; metadata?: PostMeta };

// The bundler's `require.context` finds every content/posts/<folder>/post.mdx
// when the site is built, so adding a folder is all it takes to add a post.
declare const require: {
  context(
    directory: string,
    includeSubdirectories: boolean,
    filter: RegExp,
  ): { keys(): string[]; (key: string): PostModule };
};

const modules = require.context("../content/posts", true, /^\.\/[^/]+\/post\.mdx$/);

function loadPosts(): Post[] {
  return modules
    .keys()
    .map((key) => {
      // key looks like "./2026-hello-world/post.mdx"
      const slug = key.split("/")[1];
      const mod = modules(key);
      const meta = mod.metadata;

      if (!meta?.title || !meta?.date || !meta?.description) {
        throw new Error(
          `content/posts/${slug}/post.mdx must export metadata with a title, date and description.`,
        );
      }

      return {
        ...meta,
        slug,
        year: new Date(meta.date).getUTCFullYear(),
        Content: mod.default,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

let cache: Post[] | undefined;

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  return (cache ??= loadPosts());
}

/** A single post, or null if there is no such post (or it is a draft). */
export function getPost(slug: string): Post | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const dayMonthFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "12 November 2026" */
export function formatDate(date: string): string {
  return dateFormat.format(new Date(date));
}

/** "12 Nov" */
export function formatDayMonth(date: string): string {
  return dayMonthFormat.format(new Date(date));
}
