"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { asset } from "@/lib/site";
import { Spark } from "./Icons";

const LINKS = [
  { href: "/", label: "Heute" },
  { href: "/archiv", label: "Archiv" },
  { href: "/merkliste", label: "Merkliste" },
  { href: "/fuer-grosse", label: "Für Große" },
];

export function Header() {
  const path = usePathname();
  return (
    <header className="top">
      <div className="wrap top-in">
        <Link href="/" className="mark" aria-label="wunderfunken, zur Startseite">
          <Spark /><span className="markword">wunderfunken<i>.</i></span>
        </Link>
        <nav className="nav" aria-label="Hauptnavigation">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(asset("/sw.js")).catch(() => undefined);
    }
  }, []);
  return null;
}
