import type { Metadata } from "next";
import Link from "next/link";
import { formatDayMonth, getAllPosts } from "@/lib/posts";
import { site } from "@/site.config";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: "/",
    title: `${site.name} by ${site.author}`,
    description: site.description,
  },
};

// Tells search engines this is a blog and who writes it.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${site.name} by ${site.author}`,
  description: site.description,
  url: site.url,
  author: { "@type": "Person", name: site.author, url: site.authorUrl },
};

export default function Home() {
  const posts = getAllPosts();
  // The row at the top of the list for the post that does not exist yet.
  const nextYear = posts.length > 0 ? posts[0].year + 1 : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="py-12 sm:py-20">
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl">
          Hello
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          {site.description}
        </p>
      </section>

      <section aria-labelledby="posts-heading">
        <div className="font-display flex items-baseline justify-between">
          <h2 id="posts-heading">Posts</h2>
          <p className="text-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"} so far
          </p>
        </div>

        <ol>
          {nextYear ? (
            <li
              aria-hidden
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-dashed border-rule py-7 sm:gap-x-10"
            >
              <span className="font-display text-6xl leading-none text-rule tabular-nums sm:text-7xl">
                {nextYear}
              </span>
              <span className="text-muted">Maybe later</span>
            </li>
          ) : null}

          {posts.map((post) => (
            <li key={post.slug} className="border-b border-rule">
              <Link
                href={`/posts/${post.slug}`}
                prefetch
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-7 sm:gap-x-10"
              >
                <span className="font-display text-6xl leading-none tabular-nums transition-colors group-hover:text-accent sm:text-7xl">
                  {post.year}
                </span>

                <span className="flex min-w-0 flex-col gap-2">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-3xl leading-tight sm:text-4xl">
                      {post.title}
                    </span>
                    <time
                      dateTime={post.date}
                      className="text-muted"
                    >
                      {formatDayMonth(post.date)}
                    </time>
                  </span>
                  <span className="leading-relaxed text-muted">
                    {post.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
