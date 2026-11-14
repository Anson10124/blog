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
    default: `${site.name}`,
    template: `%s in ${site.name}`,
  },
  description: site.description,
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    siteName: site.name,
    type: "website",
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
