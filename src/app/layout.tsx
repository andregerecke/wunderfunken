import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/nunito-sans";
import "./globals.css";
import { Header, ServiceWorker } from "@/components/Chrome";
import { PersonalProvider } from "@/components/Personal";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Wunderfunken: Jeden Tag ein bisschen schlauer", template: "%s · Wunderfunken" },
  description: "Ein tägliches Wissenshäppchen für Eltern und Kinder.",
  manifest: asset("/manifest.webmanifest"),
  icons: { icon: asset("/icons/icon-192.png"), apple: asset("/icons/apple-touch-icon.png") },
  appleWebApp: { capable: true, title: "Wunderfunken", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#F8F6EF", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  const body = <><a href="#inhalt" className="skip">Zum Inhalt springen</a><Header /><main id="inhalt">{children}</main>
    <footer className="foot"><div className="wrap">
      <p>Jeden Tag ein bisschen schlauer. Eure Merkliste bleibt auf diesem Gerät.</p>
    </div></footer><ServiceWorker /></>;
  return (
    <html lang="de">
      <body>
        <PersonalProvider>{body}</PersonalProvider>
      </body>
    </html>
  );
}
