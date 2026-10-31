"use client";

import { useEffect, useState } from "react";
import { currentIssueDate, formatGermanDate } from "@/domain/time";

/** Die Seite ist fertig gebaut, nur das Gerät kennt die Uhrzeit. Eine alte Ausgabe behält ihr Datum und heißt nie „Heute“. */
export function IssueStamp({ issueDate }: { issueDate: string }) {
  const [current, setCurrent] = useState<boolean | null>(null);
  useEffect(() => setCurrent(currentIssueDate(new Date()) <= issueDate), []);
  const label = current === null ? "Ausgabe vom" : current ? "Heute:" : "Letzte Ausgabe:";
  return (
    <>
      <p className="eyebrow">{label} {formatGermanDate(issueDate)}</p>
      {current === false && <p className="notice" role="status">Die nächste Ausgabe ist noch nicht fertig. Bis dahin bleibt dieses Häppchen für euch hier.</p>}
    </>
  );
}
