import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { siteTitle } from "@/lib/seo";

/** Rendered at build time: this is the preview card on WhatsApp, LinkedIn, X, etc. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteTitle;

export default async function Image() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090c",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* accent glows */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(240,180,41,0.42) 0%, rgba(8,9,12,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(232,129,74,0.30) 0%, rgba(8,9,12,0) 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#f7d07a,#f0b429 50%,#e8814a)",
              color: "#08090c",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#d7d2c9",
              fontSize: 24,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#f0b429",
              }}
            />
            Available for new projects
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "#f8f6f2", fontSize: 78, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", color: "#9b958b", fontSize: 34, lineHeight: 1.35, maxWidth: 940 }}>
            {`${profile.yearsExperience}+ years building web platforms, mobile apps and AI automation. MERN · MEAN · Python`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 30,
            color: "#6d6860",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex" }}>{profile.email}</div>
          <div style={{ display: "flex" }}>{profile.phone}</div>
        </div>
      </div>
    ),
    size,
  );
}
