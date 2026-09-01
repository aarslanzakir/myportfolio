import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";

/**
 * Per-case-study preview card. As with the service route, declaring
 * `openGraph` in the page metadata replaces the inherited image, so a
 * shared link would otherwise have no preview.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const study = caseStudyBySlug((await params).slug);
  return [
    {
      id: "card",
      size,
      contentType,
      alt: `${study?.metaTitle ?? "Case study"} | ${profile.name}`,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const study = caseStudyBySlug((await params).slug);
  const heading = study?.title ?? "Case study";
  const sub = study ? `${study.client} · ${study.year}` : profile.role;

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
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
              padding: "12px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#d7d2c9",
              fontSize: 24,
            }}
          >
            Case study
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#f8f6f2",
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            {heading}
          </div>
          <div
            style={{
              display: "flex",
              color: "#9b958b",
              fontSize: 32,
              lineHeight: 1.35,
              maxWidth: 940,
            }}
          >
            {sub}
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
          <div style={{ display: "flex" }}>{profile.name}</div>
          <div style={{ display: "flex" }}>{profile.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
