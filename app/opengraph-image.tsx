import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { site } from "@/site.config";

// The link preview image for the home page (and any page without its own).
export const alt = `${site.name} by ${site.author}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    eyebrow: "Hello",
    title: `${site.name} by ${site.author}`,
    description: site.description,
    footer: site.tagline,
  });
}
