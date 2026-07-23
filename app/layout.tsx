import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SwRegister } from "@/components/sw-register";

export const metadata: Metadata = { title: "정처기 CBT", description: "정보처리기사 필기 기출 1,200문항과 프로그래밍 핵심 정리", icons: { icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] }, appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "정처기 CBT" }, formatDetection: { telephone: false } };
export const viewport: Viewport = { themeColor: "#17251f", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><SwRegister />{children}</body></html>; }
