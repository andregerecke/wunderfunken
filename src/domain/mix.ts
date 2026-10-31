import type { Format, World } from "./worlds";
import { FORMAT_KEYS, WORLD_KEYS } from "./worlds";

export const WINDOW = 10;
export const MAX_STEM_SHARE = 0.4;
export const MAX_SEED_STEM = 9;
const MAX_WORLD_IN_WINDOW = 3;
export const REVIEW_EVERY = 5;

export type IssueFacts = {
  issueDate: string;
  postId: string;
  world: World;
  format: Format;
  isStem: boolean;
  concept: string;
  hasReview: boolean;
};

/** Im Anlauf proportional, ab einem vollen Fenster fest 4 von 10. Der erste Beitrag ist frei. */
function stemAllowance(windowSize: number): number {
  return Math.max(1, Math.floor(windowSize * MAX_STEM_SHARE));
}

export type SlotPlan = {
  allowStem: boolean;
  requireNonStem: boolean;
  formats: Format[];
  worlds: World[];
  avoidConcepts: string[];
};

/** Harte Vorgaben für die nächste Ausgabe. `recent` ist absteigend nach Datum. */
export function planNextSlot(recent: IssueFacts[]): SlotPlan {
  const window = recent.slice(0, WINDOW - 1);
  const stemCount = window.filter((r) => r.isStem).length;
  const allowStem = stemCount + 1 <= stemAllowance(window.length + 1);
  const last = recent[0];

  const formats = FORMAT_KEYS.filter((f) => f !== last?.format);
  const counts = new Map<World, number>();
  for (const r of window) counts.set(r.world, (counts.get(r.world) ?? 0) + 1);
  const worlds = WORLD_KEYS.filter(
    (w) => w !== last?.world && (counts.get(w) ?? 0) < MAX_WORLD_IN_WINDOW,
  ).sort((a, b) => (counts.get(a) ?? 0) - (counts.get(b) ?? 0));

  return {
    allowStem,
    requireNonStem: !allowStem,
    formats,
    worlds,
    avoidConcepts: recent.map((r) => r.concept),
  };
}

export type MixCandidate = Pick<IssueFacts, "world" | "format" | "isStem" | "concept">;

export function slotViolations(plan: SlotPlan, c: MixCandidate): string[] {
  const out: string[] = [];
  if (c.isStem && !plan.allowStem) out.push("STEM-Anteil im Fenster wäre überschritten");
  if (!plan.formats.includes(c.format)) out.push("Format wiederholt sich direkt");
  if (!plan.worlds.includes(c.world)) out.push("Wissenswelt zu dicht oder direkt wiederholt");
  const key = normalize(c.concept);
  if (plan.avoidConcepts.some((a) => normalize(a) === key)) out.push("Konzept kam bereits vor");
  return out;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-zäöüß0-9]+/g, " ").trim();
}

/** Prüft jedes vollständige 10er-Fenster einer Folge von Ausgaben (aufsteigend oder absteigend). */
export function rollingWindowsOk(issues: Pick<IssueFacts, "isStem">[]): boolean {
  for (let i = 0; i + WINDOW <= issues.length; i++) {
    const n = issues.slice(i, i + WINDOW).filter((x) => x.isStem).length;
    if (n > WINDOW * MAX_STEM_SHARE) return false;
  }
  return true;
}

export type Discovery = { postId: string; title: string; confirmedAt: string };

/**
 * Etwa jede fünfte Ausgabe darf zurückblicken, aber nur auf ein tatsächlich bestätigtes Thema.
 * Geöffnete oder gemerkte Beiträge sind keine Grundlage.
 */
export function pickReview(recent: IssueFacts[], discoveries: Discovery[]): Discovery | null {
  if (discoveries.length === 0) return null;
  const sinceLast = recent.findIndex((r) => r.hasReview);
  const gap = sinceLast === -1 ? recent.length : sinceLast;
  if (gap < REVIEW_EVERY - 1) return null;
  const recentIds = new Set(recent.slice(0, 3).map((r) => r.postId));
  const pool = discoveries
    .filter((d) => !recentIds.has(d.postId))
    .sort((a, b) => a.confirmedAt.localeCompare(b.confirmedAt));
  return pool[0] ?? null;
}
