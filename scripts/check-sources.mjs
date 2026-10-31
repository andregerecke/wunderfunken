// Ruft jede Quelle wirklich ab und prüft die erwarteten Belegstellen. Schreibt nur bestandene Quellen.
import { writeFileSync } from "node:fs";
import { SOURCES } from "../src/content/sources.mjs";

const today = new Date().toISOString().slice(0, 10);
const out = {}; let failed = 0;
for (const [slug, list] of Object.entries(SOURCES)) {
  out[slug] = [];
  for (const s of list) {
    try {
      const res = await fetch(s.url, { headers: { "user-agent": "Wunderfunken-Quellencheck/1.0 (private Familien-App)" } });
      const text = (await res.text()).replace(/&nbsp;| /g, " ");
      const missing = s.evidence.filter((e) => !text.includes(e));
      if (!res.ok || missing.length) { failed++; console.log(`FEHLT ${slug} ${s.url} status=${res.status} ${missing}`); continue; }
      out[slug].push({ title: s.title, url: s.url, publisher: s.publisher, checkedAt: today });
    } catch (e) { failed++; console.log(`FEHLER ${slug} ${s.url} ${e.message}`); }
    await new Promise((r) => setTimeout(r, 250));
  }
}
writeFileSync(new URL("../src/content/source-checks.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`fertig, ${failed} Probleme`);
