import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { profile, services } from "@/lib/content";
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

/** Set NEXT_PUBLIC_SITE_URL in your host's env once you have a domain. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliarslanzakir.com";

const title = `${profile.name} | Full-Stack Developer & AI Automation Engineer`;
const description = `${profile.yearsExperience}+ years building MERN, MEAN and Laravel web apps, mobile apps, Python back-ends, blockchain platforms and AI automation. Hourly, weekly or fixed price. Available for new client projects.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Person + Service schema: helps Google show this as a freelancer profile. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-Stack Developer & AI Automation Engineer",
  description,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: siteUrl,
  knowsAbout: [
    "MERN Stack",
    "MEAN Stack",
    "React",
    "Next.js",
    "Node.js",
    "Angular",
    "Python",
    "Django",
    "FastAPI",
    "React Native",
    "AI Automation",
    "Large Language Models",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
  ],
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.blurb },
  })),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Public chrome (nav + footer) is added by app/(site)/layout.tsx so
          that /admin can render its own full-width shell instead. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
