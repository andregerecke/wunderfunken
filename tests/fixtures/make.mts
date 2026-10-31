// Erzeugt die Beispielausgabe für die Browsertests. Sie ist absichtlich alt und zeigt so den Hinweis „Letzte Ausgabe“.
import { mkdirSync, writeFileSync } from "node:fs";
import { SEED_POSTS } from "../../src/content/seed";

const post = { ...SEED_POSTS[1]!, id: "issue-2026-10-30", slug: "beispiel-ausgabe", title: "Eine Beispielausgabe", teaser: "Diese Ausgabe gibt es nur in den Browsertests.", concept: "Beispielkonzept", topics: ["Beispiel"], isSeed: false };
const url = post.sources[0]!.url;
mkdirSync("tests/fixtures/issues", { recursive: true });
writeFileSync("tests/fixtures/issues/2026-10-30.json", JSON.stringify({
  issueDate: "2026-10-30", post,
  claims: [{ claim: "Ein erster Beispielbeleg.", url, quote: "Ein Beispielzitat hier" }, { claim: "Ein zweiter Beispielbeleg.", url, quote: "Noch ein Beispielzitat" }],
}, null, 2));
