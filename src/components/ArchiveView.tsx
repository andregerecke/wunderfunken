"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { filterCards, type ArchiveCard } from "@/domain/archive";
import { FORMATS, FORMAT_KEYS, WORLDS, WORLD_KEYS, type Format, type World } from "@/domain/worlds";
import { asset } from "@/lib/site";
import { CardGrid } from "./PostCardView";

const PAGE_SIZE = 12;

function href(p: { q?: string; welt?: string; format?: string; seite?: number }) {
  const s = new URLSearchParams();
  if (p.q) s.set("q", p.q);
  if (p.welt) s.set("welt", p.welt);
  if (p.format) s.set("format", p.format);
  if (p.seite && p.seite > 1) s.set("seite", String(p.seite));
  const t = s.toString();
  return t ? `/archiv?${t}` : "/archiv";
}

export function ArchiveView({ cards, worlds }: { cards: ArchiveCard[]; worlds: World[] }) {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim().slice(0, 80) || undefined;
  const rawWelt = sp.get("welt"), rawFormat = sp.get("format");
  const welt = WORLD_KEYS.includes(rawWelt as World) ? (rawWelt as World) : undefined;
  const format = FORMAT_KEYS.includes(rawFormat as Format) ? (rawFormat as Format) : undefined;
  const page = Math.max(1, Number(sp.get("seite")) || 1);
  const matches = filterCards(cards, { q, world: welt, format });
  const items = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.ceil(matches.length / PAGE_SIZE);
  const filtered = Boolean(q || welt || format);

  return (
    <>
      <div className="tools" style={{ gridTemplateColumns: "1fr" }}>
        <form className="search" action={asset("/archiv")} role="search">
          {welt && <input type="hidden" name="welt" value={welt} />}
          {format && <input type="hidden" name="format" value={format} />}
          <label className="sr" htmlFor="suche">Titel, Beschreibung und Themen suchen</label>
          <input key={q} id="suche" name="q" type="search" defaultValue={q} placeholder="Wonach suchst du?" />
          <button className="btn small" type="submit">Suchen</button>
        </form>
        <div className="chips" role="group" aria-label="Format">
          {FORMAT_KEYS.map((f) => (
            <Link key={f} className="chip" aria-current={format === f ? "true" : undefined}
              href={href({ q, welt, format: format === f ? undefined : f })}>{FORMATS[f]}</Link>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Wissenswelt">
          {worlds.map((world) => (
            <Link key={world} className="chip" aria-current={welt === world ? "true" : undefined}
              href={href({ q, welt: welt === world ? undefined : world, format })}>{WORLDS[world].label}</Link>
          ))}
        </div>
      </div>
      <p role="status" className="read-status">{matches.length === 1 ? "1 Häppchen" : `${matches.length} Häppchen`}</p>
      {items.length > 0 ? <CardGrid cards={items} /> : (
        <div className="empty">
          <h2>Dazu haben wir noch nichts gefunden</h2>
          <p>Probiert ein anderes Wort oder weniger Filter.</p>
          <Link className="btn" href="/archiv">Filter zurücksetzen</Link>
        </div>
      )}
      {filtered && items.length > 0 && <div><Link className="btn ghost small" href="/archiv">Filter zurücksetzen</Link></div>}
      {pages > 1 && (
        <nav className="pager" aria-label="Seiten">
          {page > 1 && <Link className="btn ghost small" href={href({ q, welt, format, seite: page - 1 })}>Zurück</Link>}
          <span>Seite {page} von {pages}</span>
          {page < pages && <Link className="btn ghost small" href={href({ q, welt, format, seite: page + 1 })}>Weiter</Link>}
        </nav>
      )}
    </>
  );
}
