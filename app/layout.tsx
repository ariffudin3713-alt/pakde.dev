import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pasar UMKM - Temukan & Dukung Usaha Lokal Indonesia",
  description:
    "Direktori usaha lokal Indonesia. Temukan produk dan jasa dari UMKM di sekitar, hubungi langsung via WhatsApp tanpa komisi. Gratis untuk semua!",
  openGraph: {
    title: "Pasar UMKM - Dukung Usaha Lokal",
    description: "Temukan usaha lokal terdekat, hubungi langsung tanpa perantara.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
