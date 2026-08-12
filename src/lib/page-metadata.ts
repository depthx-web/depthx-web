import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

// Next.js metadata merging is shallow: a page that sets its own `openGraph`
// or `twitter` object fully replaces the parent's (including the root
// layout's site-wide og:image, from opengraph-image.tsx) rather than
// deep-merging. Per Next's own docs, the fix is to re-declare shared fields
// in every page that overrides these objects — hence repeating `images`/
// `card`/`siteName` here instead of relying on inheritance from the layout.
const SHARED_OG_IMAGE = { images: ["/opengraph-image"] };

/** Shared shape for per-page <title>/description/OG/Twitter/canonical tags (spec §7 SEO). */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** Comma-separated keywords, or an array — rendered as <meta name="keywords">. */
  keywords?: string | string[];
  /** Overrides the default site OG image (e.g. a news post's featured image). */
  image?: string;
}): Metadata {
  const ogImage = image ? { images: [image] } : SHARED_OG_IMAGE;
  return {
    title,
    description,
    ...(keywords
      ? { keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords }
      : {}),
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, ...ogImage },
    twitter: { title, description, card: "summary_large_image", ...ogImage },
  };
}

/** Merges per-item `keywords` strings (e.g. every research domain on the Research page) into one deduped list. */
export function mergeKeywords(items: { keywords?: string }[]): string | undefined {
  const all = items
    .flatMap((item) => (item.keywords ? item.keywords.split(",") : []))
    .map((k) => k.trim())
    .filter(Boolean);
  const unique = Array.from(new Set(all));
  return unique.length ? unique.join(", ") : undefined;
}
