import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DepthGauge } from "@/components/depth-gauge";
import { SectionVisibilityProvider } from "@/components/section-visibility-provider";
import { StructuredData } from "@/components/structured-data";
import { Analytics } from "@/components/analytics";
import { PageTracker } from "@/components/page-tracker";
import { getLegalPages, getSiteSettings } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const [settings, legalPages] = await Promise.all([getSiteSettings(), getLegalPages()]);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${inter.variable}`}
      // The blocking theme script below intentionally mutates data-theme on
      // this element before hydration — that's a deliberate, expected
      // mismatch (see components/theme-toggle.tsx), not a real bug.
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-bg font-body text-text">
        <script
          // Sets [data-theme="light"] on <html> before first paint if the
          // visitor previously chose light mode, or if they've never chosen
          // and their OS prefers light — avoids a flash of the wrong theme.
          // Dark is the default: no attribute needed for it (see globals.css).
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(!t&&window.matchMedia('(prefers-color-scheme: light)').matches){t='light';}if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();",
          }}
        />
        <Analytics />
        <PageTracker />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            email: settings.contactEmails.investor,
          }}
        />
        <SectionVisibilityProvider visibility={settings.sectionVisibility}>
          <DepthGauge />
          <Nav sectionVisibility={settings.sectionVisibility} logoUrl={settings.logoUrl} />
          <main>{children}</main>
          <Footer settings={settings} legalPages={legalPages} />
        </SectionVisibilityProvider>
      </body>
    </html>
  );
}
