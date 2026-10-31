// Prüft alle Tagesausgaben. Mit --net zusätzlich die Belege der neuesten Ausgabe an den echten Quellen.
import { existsSync, readFileSync } from "node:fs";
import { SEED_POSTS } from "../src/content/seed";
import { issueViolations, quoteFound, svgViolations } from "../src/domain/issue";
import { loadIssues } from "../src/lib/content";

const issues = loadIssues();
const problems: string[] = [];

issues.forEach((issue, i) => {
  const report = (msg: string) => problems.push(`${issue.issueDate}: ${msg}`);
  issueViolations(issue, issues.slice(i + 1), SEED_POSTS).forEach(report);
  const file = `public${issue.post.image.src}`;
  if (existsSync(file)) svgViolations(readFileSync(file, "utf8")).forEach(report);
  else report(`Bild fehlt: ${file}`);
});

if (process.argv.includes("--net") && issues[0]) {
  const newest = issues[0];
  for (const url of new Set(newest.claims.map((c) => c.url))) {
    const res = await fetch(url, { headers: { "user-agent": "WunderfunkenQuellenpruefung/1.0" } });
    if (!res.ok) { problems.push(`${newest.issueDate}: Quelle antwortet nicht: ${url}`); continue; }
    const html = await res.text();
    for (const c of newest.claims.filter((x) => x.url === url)) {
      if (!quoteFound(html, c.quote)) problems.push(`${newest.issueDate}: Zitat nicht gefunden: „${c.quote}“ in ${url}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`${issues.length} Tagesausgaben in Ordnung.`);
