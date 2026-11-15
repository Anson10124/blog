import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/site.config";
import "./globals.css";

// Body text: Hedvig Letters Sans (OFL), only ships a Regular weight.
const sans = localFont({
  src: "./fonts/hedvig/HedvigLettersSans-Regular.woff2",
  variable: "--font-sans-body",
  weight: "400",
  style: "normal",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used for titles and the big year numerals: LT Wave.
const display = localFont({
  src: [
    { path: "./fonts/ltwave/LTWave-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/ltwave/LTWave-Italic.otf", weight: "400", style: "italic" },
    { path: "./fonts/ltwave/LTWave-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} by ${site.author}`,
    template: `%s in ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author, url: site.authorUrl }],
  creator: site.author,
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  // The dark mark shows on light browser chrome and the light mark on dark.
  icons: {
    icon: [
      {
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  // The preview image itself comes from the opengraph-image.tsx files.
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    creator: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    // Let Google show the full preview image and description in results.
    googleBot: { "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 sm:px-8">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        {process.env.NODE_ENV === "production" && (
          // Pageviews (including Next.js client-side route changes) are tracked
          // automatically; custom events use data-insightflare-event attributes.
          <script
            defer
            src={`${site.insightflare.scriptUrl}?siteId=${site.insightflare.siteId}`}
          />
        )}
      </body>
    </html>
  );
}
