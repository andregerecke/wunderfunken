"use client";

import { formatGermanDateTime } from "@/domain/time";
import { BookmarkIcon, CheckIcon } from "./Icons";
import { usePersonal } from "./Personal";

export function SaveIconButton({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const { saved, toggleSave, ready } = usePersonal();
  const on = saved.has(slug);
  return (
    <button type="button" className={`icon-btn ${className ?? ""}`} aria-pressed={on} disabled={!ready}
      aria-label={on ? `${title} von der Merkliste nehmen` : `${title} merken`} onClick={() => toggleSave(slug)}>
      <BookmarkIcon filled={on} />
    </button>
  );
}

export function SaveButton({ slug, title }: { slug: string; title: string }) {
  const { saved, toggleSave, ready } = usePersonal();
  const on = saved.has(slug);
  return (
    <button type="button" className="btn ghost small" aria-pressed={on} disabled={!ready} onClick={() => toggleSave(slug)}
      aria-label={on ? `${title} von der Merkliste nehmen` : `${title} merken`}>
      <BookmarkIcon filled={on} /> {on ? "Gemerkt" : "Merken"}
    </button>
  );
}

export function DiscoverPanel({ slug, title }: { slug: string; title: string }) {
  const { discovered, confirm, withdraw, ready } = usePersonal();
  const entry = discovered.get(slug);
  return (
    <section className="discover" aria-label="Gemeinsam entdeckt">
      {entry ? (
        <>
          <p><strong>Gemeinsam entdeckt</strong> am {formatGermanDateTime(entry.at)}.</p>
          <button type="button" className="linkish" onClick={() => withdraw(slug)}>Markierung zurücknehmen</button>
        </>
      ) : (
        <>
          <p>Habt ihr das Thema zusammen angeschaut und besprochen?</p>
          <button type="button" className="btn" disabled={!ready} onClick={() => confirm(slug, title)}>
            <CheckIcon /> Gemeinsam entdeckt
          </button>
        </>
      )}
    </section>
  );
}

export function DoneTag({ slug }: { slug: string }) {
  const { discovered } = usePersonal();
  return discovered.has(slug) ? <span className="done-tag">Entdeckt</span> : null;
}
