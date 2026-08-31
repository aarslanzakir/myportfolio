import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Don't advertise the framework and version to scanners. */
  poweredByHeader: false,

  /** Emit gzip for HTML/JSON when a CDN or proxy isn't already doing it. */
  compress: true,

  /**
   * A trailing-slash variant of the same URL is a duplicate as far as
   * Google is concerned. Pinning this makes the redirect deterministic
   * and keeps it matching the canonical tag.
   */
  trailingSlash: false,

  images: {
    /* AVIF first, WebP fallback: the hero photo is the LCP element, and
       its transfer size is the largest single lever on that score. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
