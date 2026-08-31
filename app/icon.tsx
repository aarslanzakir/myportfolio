import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

/**
 * Generated PWA / high-DPI icon. `favicon.ico` still covers the browser
 * tab; this is the larger square Android, Windows tiles and the install
 * prompt reach for.
 */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const initials = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2);

export default function Icon() {
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
          fontSize: 240,
          fontWeight: 700,
          letterSpacing: -8,
        }}
      >
        {initials}
      </div>
    ),
    size,
  );
}
