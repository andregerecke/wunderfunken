import type { Post } from "./post";
import { postSchema } from "./post";

/** Ausschlüsse aus dem Briefing. Bewusst breit: Ein Fehlalarm kostet einen Reparaturversuch, kein Risiko. */
const FORBIDDEN: [RegExp, string][] = [
  [/\b(kerzen?|streichh[öo]lz\w*|feuerzeug\w*|anz[üu]nd\w*|herd\w*|backofen\w*|b[üu]gel\w*|kochend\w*|hei[ßs]e[snrm]? wasser)\b/i, "Hitze oder Feuer"],
  [/\b(steckdose\w*|netzstrom\w*|stromkabel\w*|netzstecker\w*|230 ?v\w*)\b/i, "Netzstrom"],
  [/\b(luft anhalten|atem anhalten|atemanhalten|halte die luft|halt die luft)\b/i, "Atemanhalten"],
  [/\b(knopfzelle\w*|neodym\w*|magnet\w*)\b/i, "Knopfzellen oder Magnete"],
  [/\b(bleiche\w*|chlor\w*|reiniger\w*|lauge\w*|s[äa]ure\w*|medikament\w*|tablette\w*)\b/i, "gefährliche Stoffe"],
  [/\b(kletter\w*|klettere\w*|auf (das|die) dach|leiter\w*)\b/i, "Klettern"],
  [/\b(kost(e|et) (die|den|das) (pilz|beere)\w*|pilze sammeln|beeren sammeln|iss die|probier(e)? die beere\w*)\b/i, "riskantes Essen oder Sammeln"],
];

export function safetyViolations(post: Pick<Post, "activity">): string[] {
  const text = [post.activity.title, ...post.activity.materials, ...post.activity.steps].join(" ");
  return FORBIDDEN.filter(([re]) => re.test(text)).map(([, why]) => why);
}

const MAX_EXPLANATION_WORDS = 170;
const MAX_AVG_SENTENCE_WORDS = 16;

export function languageViolations(post: Pick<Post, "explanation">): string[] {
  const text = post.explanation.join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim()).length || 1;
  const out: string[] = [];
  if (words > MAX_EXPLANATION_WORDS) out.push(`Erklärung zu lang (${words} Wörter)`);
  if (words / sentences > MAX_AVG_SENTENCE_WORDS) out.push("Sätze im Schnitt zu lang zum Vorlesen");
  return out;
}

/** Vollständiger Inhaltscheck ohne Themenmix. `allowMissingImage` nur für den Entwurf vor dem Bildschritt. */
export function contentViolations(raw: unknown, opts: { allowMissingImage?: boolean } = {}): string[] {
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  }
  const post = parsed.data as Post;
  const out = [...safetyViolations(post), ...languageViolations(post)];
  if (post.stem.isStem && !/natur|bio|physik|chem|körper|mathe|technik|astronom/i.test(post.stem.reason)) {
    out.push("STEM-Einstufung ohne fachliche Begründung");
  }
  if (!opts.allowMissingImage && post.image.status !== "ready") out.push("Bild fehlt");
  return out;
}
