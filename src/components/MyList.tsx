"use client";

import Link from "next/link";
import type { PostCard } from "@/domain/post";
import { formatGermanDateTime } from "@/domain/time";
import { usePersonal } from "./Personal";
import { CardGrid } from "./PostCardView";

export function MyList({ cards: all }: { cards: PostCard[] }) {
  const { saved, discovered, ready, withdraw } = usePersonal();
  const cards = ready ? all.filter((c) => saved.has(c.slug)) : null;
  const history = [...discovered.values()].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <>
      <h1>Merkliste</h1>
      <p className="origin">Alles hier bleibt nur auf diesem Gerät gespeichert.</p>
      {cards === null && <p>Einen Moment …</p>}
      {cards?.length === 0 && (
        <div className="empty"><h2>Noch nichts gemerkt</h2><p>Tippt bei einem Häppchen auf das Lesezeichen, dann liegt es hier bereit.</p><Link className="btn" href="/archiv">Häppchen ansehen</Link></div>
      )}
      {cards && cards.length > 0 && <CardGrid cards={cards} />}
      <h2 style={{ marginTop: 18 }}>Gemeinsam entdeckt</h2>
      {history.length === 0
        ? <p>Hier erscheinen Themen, sobald ihr sie ausdrücklich als gemeinsam entdeckt markiert. Öffnen allein zählt nicht.</p>
        : (
          <ul className="history">
            {history.map((d) => (
              <li key={d.slug}>
                <span><Link href={`/wissen/${d.slug}`}>{d.title}</Link><br /><small>{formatGermanDateTime(d.at)}</small></span>
                <button type="button" className="linkish" onClick={() => withdraw(d.slug)}>Zurücknehmen</button>
              </li>
            ))}
          </ul>
        )}
    </>
  );
}
