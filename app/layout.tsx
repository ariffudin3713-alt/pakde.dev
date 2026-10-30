import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pasar UMKM, direktori usaha lokal Indonesia",
  description:
    "Direktori usaha lokal Indonesia. Temukan warung, penjahit, pengrajin, dan jasa di kotamu, lalu hubungi pemiliknya langsung lewat WhatsApp tanpa komisi.",
  openGraph: {
    title: "Pasar UMKM, direktori usaha lokal",
    description: "Temukan usaha lokal terdekat, hubungi pemiliknya langsung tanpa perantara.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#e9e6e0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
