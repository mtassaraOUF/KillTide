import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kill Tide — Your Ocean Diary",
  description: "A private, mobile-first spearfishing journal. Move when the ocean gives you the opportunity.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/killtide-logo.png", apple: "/killtide-logo.png" },
  openGraph: {
    title: "Kill Tide — Your Ocean Diary",
    description: "Every dive leaves evidence.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kill Tide — Your Ocean Diary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kill Tide — Your Ocean Diary",
    description: "Every dive leaves evidence.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071013",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
