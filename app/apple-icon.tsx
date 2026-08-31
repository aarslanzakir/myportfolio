import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

/**
 * iOS home-screen icon. Apple does not round the corners of a
 * `apple-touch-icon`, so it gets the flat brand square, and it must be
 * fully opaque: iOS composites transparency onto black.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const initials = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2);

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#f7d07a,#f0b429 50%,#e8814a)",
          color: "#08090c",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        {initials}
      </div>
    ),
    size,
  );
}
