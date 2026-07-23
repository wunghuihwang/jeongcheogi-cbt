import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    name: "정처기 CBT",
    short_name: "정처기 CBT",
    description: "정보처리기사 필기 기출 CBT와 C·Java·Python·SQL 핵심 정리",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5ef",
    theme_color: "#17251f",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
