import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";
import { siteDescription } from "@/lib/seo";

/** Installable-PWA basics. Also what Android uses for the home-screen icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | Full-Stack Developer & AI Automation Engineer`,
    short_name: profile.name.split(" ")[0],
    description: siteDescription,
    id: "/",
    start_url: "/",
    scope: "/",
    lang: "en",
    categories: ["business", "productivity", "developer"],
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#05060a",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
