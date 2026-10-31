import { describe, expect, it } from "vitest";
import { SEED_POSTS } from "@/content/seed";
import { filterCards } from "@/domain/archive";
import { issueViolations, quoteFound, svgViolations, type Issue } from "@/domain/issue";
import { searchableText, toCard, type Post } from "@/domain/post";

const base = SEED_POSTS[0]!;
const URL_A = "https://de.wikipedia.org/wiki/Regenbogen";

function issue(date: string, n: string, over: Partial<Post> = {}): Issue {
  const slug = `ausgabe-${n}`;
  return {
    issueDate: date,
    post: {
      ...base, id: `issue-${date}`, slug, concept: `Eigenes Konzept ${n}`, isSeed: false, minutes: 6,
      stem: { isStem: false, reason: "Sprache und Alltag ohne Fachbezug" },
      image: { ...base.image, src: `/illustrations/${slug}.svg`, origin: "Von Claude gezeichnet" },
      sources: [{ title: "Regenbogen", url: URL_A, publisher: "Wikipedia", checkedAt: `${date}T06:00:00Z` }],
      ...over,
    },
    claims: [
      { claim: "Licht wird im Tropfen gebrochen.", url: URL_A, quote: "Brechung des Lichts im Tropfen" },
      { claim: "Es entstehen Farben im Bogen.", url: URL_A, quote: "Farben im großen Bogen" },
    ],
  };
}

describe("Tagesausgabe", () => {
  it("lässt eine saubere Ausgabe durch", () => {
    expect(issueViolations(issue("2026-11-01", "a"), [], SEED_POSTS)).toEqual([]);
  });
  it("lehnt fremde Quellen, doppelte Beiträge und zu lange Häppchen ab", () => {
    const other = issue("2026-11-01", "a", { sources: [{ title: "Blog", url: "https://example.com/x", publisher: "Blog", checkedAt: "2026-11-01" }] });
    expect(issueViolations(other, [], SEED_POSTS).join()).toContain("nicht freigegeben");
    expect(issueViolations(issue("2026-11-01", "a", { slug: base.slug }), [], SEED_POSTS).join()).toContain("Slug");
    expect(issueViolations(issue("2026-11-01", "a", { concept: base.concept }), [], SEED_POSTS).join()).toContain("Konzept");
    expect(issueViolations(issue("2026-11-01", "a", { minutes: 12 }), [], SEED_POSTS).join()).toContain("acht Minuten");
  });
  it("lehnt unsichere Mitmachideen ab", () => {
    const risky = issue("2026-11-01", "a", { activity: { title: "Versuch", materials: [], steps: ["Zündet eine Kerze an.", "Schaut zu."] } });
    expect(issueViolations(risky, [], SEED_POSTS)).toContain("Hitze oder Feuer");
  });
  it("hält den Themenmix gegen frühere Ausgaben ein", () => {
    const earlier = [issue("2026-11-01", "a")];
    const same = issue("2026-11-02", "b", { world: earlier[0]!.post.world, format: earlier[0]!.post.format });
    const out = issueViolations(same, earlier, SEED_POSTS);
    expect(out).toContain("Format wiederholt sich direkt");
    expect(out).toContain("Wissenswelt zu dicht oder direkt wiederholt");
  });
  it("verlangt für jeden Beleg eine genannte Quelle", () => {
    const i = issue("2026-11-01", "a");
    i.claims[0]!.url = "https://de.wikipedia.org/wiki/Anderes";
    expect(issueViolations(i, [], SEED_POSTS).join()).toContain("Beleg ohne genannte Quelle");
  });
});

describe("Bilder", () => {
  const good = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">${'<circle cx="1" cy="1" r="1"/>'.repeat(50)}</svg>`;
  it("erlaubt reine Zeichnungen", () => expect(svgViolations(good)).toEqual([]));
  it.each([
    ["<script>x</script>", "Unerlaubtes Element"], ['<rect onload="x"/>', "Ereignis"],
    ['<image href="https://x.de/a.png"/>', "Unerlaubtes Element"], ['<path d="M0" src="x"/>', "Verweis"],
  ])("sperrt %s", (bad, why) => expect(svgViolations(good.replace("</svg>", `${bad}</svg>`)).join()).toContain(why));
  it("sperrt leere Bilder", () => expect(svgViolations('<svg viewBox="0 0 1200 800"></svg>').join()).toContain("zu klein"));
});

describe("Belege", () => {
  const html = "<p>Das Licht wird<sup>[1]</sup> im&nbsp;<b>Regentropfen</b> gebrochen.</p><script>Geheimnis im Skript</script>";
  it("findet wörtliche Zitate trotz Auszeichnung", () => expect(quoteFound(html, "Licht wird im Regentropfen gebrochen")).toBe(true));
  it("findet erfundene Zitate nicht", () => expect(quoteFound(html, "Licht wird im Regentropfen gefärbt")).toBe(false));
  it("zählt keinen Skripttext", () => expect(quoteFound(html, "Geheimnis im Skript")).toBe(false));
});

describe("Archivfilter", () => {
  const cards = SEED_POSTS.map((p) => ({ ...toCard(p), search: searchableText(p) }));
  it("kombiniert Suche, Welt und Format", () => {
    const p = SEED_POSTS[0]!;
    expect(filterCards(cards, { world: p.world, format: p.format }).map((c) => c.slug)).toContain(p.slug);
    expect(filterCards(cards, { q: "raumschiffkuchen" })).toEqual([]);
    expect(filterCards(cards, {})).toHaveLength(cards.length);
  });
});
