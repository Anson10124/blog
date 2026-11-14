import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Comments } from "@/components/Comments";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/site.config";

// Every post is rendered to static HTML when the site is built.
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.author],
    },
    // giscus writes this link into the GitHub Discussion it creates for the
    // post. Without it giscus uses whatever URL the page was open on, which
    // is localhost when the first comment is made from local dev.
    other: { "giscus:backlink": `${site.url}/posts/${post.slug}` },
  };
}

export default function PostPage({ params }: PageProps<"/posts/[slug]">) {
  // The slug comes from the URL, so everything that depends on it sits inside
  // <Suspense>. Known posts are still fully rendered at build time; the
  // placeholder only shows for a moment when a page has not been prefetched.
  return (
    <Suspense>
      {params.then(({ slug }) => (
        <PostView slug={slug} />
      ))}
    </Suspense>
  );
}

function PostView({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  // Posts are sorted newest first, so "older" is the next one in the list.
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const number = posts.length - index;

  const { Content } = post;

  return (
    <article className="pt-12 sm:pt-16">
      <header className="mb-14">
        <p className="mt-10 font-display text-7xl leading-none text-accent tabular-nums sm:text-8xl">
          {post.year}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">
          {post.description}
        </p>

        <p className="font-display mt-8 flex flex-wrap gap-x-3 border-y border-rule py-3 text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>|</span>
          <span>No. {String(number).padStart(2, "0")}</span>
          <span aria-hidden>|</span>
          <span>By {site.author}</span>
        </p>
      </header>

      <div className="prose">
        <Content />
      </div>

      {newer || older ? (
        <nav
          aria-label="More posts"
          className="mt-24 grid gap-6 border-t border-rule pt-6 sm:grid-cols-2"
        >
          {older ? (
            <Link href={`/posts/${older.slug}`} className="group">
              <span className="label-mono text-muted">← {older.year}</span>
              <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-accent">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/posts/${newer.slug}`} className="group sm:text-right">
              <span className="label-mono text-muted">{newer.year} →</span>
              <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-accent">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <Comments />
    </article>
  );
}
