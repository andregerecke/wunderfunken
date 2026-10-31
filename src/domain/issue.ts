import { z } from "zod";
import { planNextSlot, rollingWindowsOk, slotViolations, type IssueFacts } from "./mix";
import { postSchema, type Post } from "./post";
import { contentViolations } from "./safety";

/** Nur diese Quellen sind in der Cloudumgebung freigegeben und dürfen in einer Tagesausgabe stehen. */
export const SOURCE_HOSTS = ["de.wikipedia.org", "klexikon.zum.de", "www.planet-wissen.de", "www.planet-schule.de", "www.geo.de"];
const MAX_SVG_BYTES = 60_000;
const MIN_SVG_BYTES = 1_000;
const MAX_MINUTES = 8;

export const issueSchema = z.object({
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  post: postSchema,
  /** Belege für die Prüfung vor der Veröffentlichung. Sie erscheinen nicht in der App. */
  claims: z.array(z.object({ claim: z.string().min(10), url: z.url(), quote: z.string().min(15) })).min(2),
});
export type Issue = Omit<z.infer<typeof issueSchema>, "post"> & { post: Post };

export function toFacts(i: Issue): IssueFacts {
  return {
    issueDate: i.issueDate, postId: i.post.id, world: i.post.world, format: i.post.format,
    isStem: i.post.stem.isStem, concept: i.post.concept, hasReview: Boolean(i.post.review),
  };
}

/** `earlier` ist absteigend nach Datum und enthält nur ältere Ausgaben. */
export function issueViolations(issue: Issue, earlier: Issue[], seeds: Post[]): string[] {
  const { post, issueDate } = issue;
  const out = contentViolations(post);
  if (post.isSeed) out.push("Tagesausgabe als Startbeitrag markiert");
  if (post.minutes > MAX_MINUTES) out.push("Länger als acht Minuten");
  if (post.image.kind !== "svg" || post.image.src !== `/illustrations/${post.slug}.svg`) out.push("Bildpfad passt nicht zum Beitrag");
  const others = [...earlier.map((e) => e.post), ...seeds];
  if (others.some((o) => o.slug === post.slug)) out.push("Slug gibt es schon");
  if (others.some((o) => o.concept.toLowerCase() === post.concept.toLowerCase())) out.push("Konzept gibt es schon");
  for (const s of post.sources) {
    if (!SOURCE_HOSTS.includes(new URL(s.url).host)) out.push(`Quelle nicht freigegeben: ${s.url}`);
    if (!s.checkedAt.startsWith(issueDate)) out.push(`Quelle nicht am Ausgabetag geprüft: ${s.url}`);
  }
  for (const c of issue.claims) {
    if (!post.sources.some((s) => s.url === c.url)) out.push(`Beleg ohne genannte Quelle: ${c.url}`);
  }
  if (post.review && !others.some((o) => o.slug === post.review!.slug)) out.push("Wiederholung verweist ins Leere");
  const facts = earlier.map(toFacts);
  out.push(...slotViolations(planNextSlot(facts), {
    world: post.world, format: post.format, isStem: post.stem.isStem, concept: post.concept,
  }));
  if (!rollingWindowsOk([toFacts(issue), ...facts])) out.push("STEM-Anteil im 10er-Fenster überschritten");
  return out;
}

/** Tagesbilder gelangen ungeprüft in die Seite, deshalb sind nur reine Zeichnungen erlaubt. */
export function svgViolations(svg: string): string[] {
  const out: string[] = [];
  const bytes = new TextEncoder().encode(svg).length;
  if (!/^\s*<svg\b/.test(svg)) out.push("Datei beginnt nicht mit <svg");
  if (!/viewBox="0 0 1200 800"/.test(svg)) out.push("viewBox muss 0 0 1200 800 sein");
  if (bytes > MAX_SVG_BYTES) out.push("Bild zu groß");
  if (bytes < MIN_SVG_BYTES) out.push("Bild zu klein für eine echte Illustration");
  if (/<\s*(script|foreignObject|image|iframe|use|a|style)\b/i.test(svg)) out.push("Unerlaubtes Element im Bild");
  if (/\son\w+\s*=/i.test(svg)) out.push("Ereignis-Attribut im Bild");
  if (/(href|src)\s*=/i.test(svg)) out.push("Verweis im Bild");
  if (/https?:\/\/(?!www\.w3\.org\/)/i.test(svg)) out.push("Externe Adresse im Bild");
  return out;
}

export function normalizeText(s: string): string {
  return s
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/[“„”"]/g, '"')
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/** Ein Beleg gilt nur, wenn das Zitat wörtlich im Quelltext steht. */
export function quoteFound(html: string, quote: string): boolean {
  return normalizeText(html).includes(normalizeText(quote));
}
