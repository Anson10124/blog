import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/site.config";

// The link preview image for a post: its year, title and description.
export const alt = `A post on ${site.name} by ${site.author}`;
export const size = ogSize;
export const contentType = ogContentType;

// Draw every post's image when the site is built.
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return renderOgCard({
    eyebrow: String(post.year),
    title: post.title,
    description: post.description,
    footer: `${formatDate(post.date)} | By ${site.author}`,
  });
}
