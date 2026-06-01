import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knittin — 編み図ジェネレーター",
  description: "画像から編み図を自動生成。ゲージを入力するだけで、必要な毛糸の色と玉数まで自動計算。",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FF9900",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>{children}</body>
    </html>
  );
}
