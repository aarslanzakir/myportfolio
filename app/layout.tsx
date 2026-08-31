import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { profile } from "@/lib/content";
import { siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

/**
 * Typography: three variable fonts, all self-hosted.
 *
 * next/font downloads these at build time and serves them from your own
 * domain, so there is no runtime request to Google, no privacy caveat to
 * explain to clients, and no render-blocking stylesheet. Next also
 * generates a metric-matched fallback, so there is no layout shift.
 *
 *   Manrope        headings. Geometric, a little characterful, reads premium.
 *   Inter          body and UI. The most legible sans at small sizes.
 *   JetBrains Mono tech chips, stat figures, URLs.
 *
 * To change a font, swap the import and keep the same `variable` name.
 */
const fontDisplay = Manrope({
  variable: "--font-display-web",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const fontSans = Inter({
  variable: "--font-sans-web",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono-web",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "full stack developer",
    "MERN stack developer",
    "MEAN stack developer",
    "React developer",
    "Next.js developer",
    "Python developer",
    "AI automation",
    "AI integration",
    "React Native developer",
    "freelance web developer",
    "hire full stack developer",
    profile.name,
  ],
  publisher: profile.name,
  alternates: { canonical: "/" },
  /* Stops iOS Safari auto-linking the phone number in body copy and
     rewriting it into markup Google then reads as a separate entity. */
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
  /* Paste the token from Search Console / Bing Webmaster Tools here
     (or set the env var) to verify ownership without a DNS record. */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <head>
        {/* Without JS the reveal animation never fires: make sure content still shows */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      {/* Public chrome (nav + footer) is added by app/(site)/layout.tsx so
          that /admin can render its own full-width shell instead. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
