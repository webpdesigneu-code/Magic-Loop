import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Magic Loop | Unikalne produkty ręcznie robione",
  description: "Odkryj magiczny świat ręcznie robionych zabawek i dekoracji Magic Loop. Misie, króliki, grzybki i więcej - wszystko szyte z miłością. Wysyłka do Polski i Szwecji.",
  keywords: "handmade, ręcznie robione, zabawki, dekoracje, misie, grzybki, króliki, tulipany, polska, szwecja, handgjord, leksaker, magic loop",
  authors: [{ name: "Anna" }],
  openGraph: {
    title: "Magic Loop - Handmade Workshop",
    description: "Unikalne produkty ręcznie robione z pasją",
    type: "website",
  },
  icons: {
    icon: '/design/logo.png',
    shortcut: '/design/logo.png',
    apple: '/design/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <LanguageProvider>
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
