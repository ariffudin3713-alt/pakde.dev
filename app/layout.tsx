import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pasar UMKM — Temukan usaha lokal, dukung sekitar",
  description:
    "Direktori usaha lokal Indonesia. Temukan produk dan jasa dari tetangga, lalu hubungi penjual langsung tanpa komisi.",
  openGraph: {
    title: "Pasar UMKM",
    description: "Usaha lokal yang lebih mudah ditemukan.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f6f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
