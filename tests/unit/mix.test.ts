import { describe, expect, it } from "vitest";
import { SEED_POSTS } from "@/content/seed";
import { pickReview, planNextSlot, rollingWindowsOk, slotViolations, type IssueFacts } from "@/domain/mix";
import type { Format, World } from "@/domain/worlds";

const issue = (i: number, o: Partial<IssueFacts> = {}): IssueFacts => ({
  issueDate: `2026-10-${String(30 - i).padStart(2, "0")}`, postId: `p${i}`, world: "sprache" as World, format: "warum" as Format,
  isStem: false, concept: `Konzept ${i}`, hasReview: false, ...o,
});

describe("Themenmix", () => {
  it("lässt den ersten Beitrag frei und bremst STEM im Anlauf", () => {
    expect(planNextSlot([]).allowStem).toBe(true);
    expect(planNextSlot([issue(0, { isStem: true })]).allowStem).toBe(false);
  });
  it("erlaubt keine fünf STEM im vollen Fenster", () => {
    const recent = Array.from({ length: 9 }, (_, i) => issue(i, { isStem: i < 4 }));
    const plan = planNextSlot(recent);
    expect(plan.allowStem).toBe(false);
    expect(slotViolations(plan, { world: "natur", format: "probieren", isStem: true, concept: "Neu" })).toContain("STEM-Anteil im Fenster wäre überschritten");
  });
  it("wertet Natur nicht pauschal als Nicht-STEM: entscheidend ist isStem, nicht die Welt", () => {
    const bestaeubung = SEED_POSTS.find((p) => p.slug === "bienen-als-pollen-boten")!;
    const herz = SEED_POSTS.find((p) => p.slug === "dein-herz-die-pumpe")!;
    expect(bestaeubung.world).toBe("natur");
    expect(bestaeubung.stem.isStem).toBe(true);
    expect(herz.stem.isStem).toBe(true);
    expect(SEED_POSTS.find((p) => p.slug === "die-welt-von-oben")!.stem.isStem).toBe(false);
    expect(SEED_POSTS.find((p) => p.slug === "ein-gegenbeispiel-reicht")!.stem.isStem).toBe(false);
  });
  it("verbietet direkte Wiederholung von Format und Welt und bekannte Konzepte", () => {
    const plan = planNextSlot([issue(0, { format: "probieren", world: "zeit", concept: "Spuren" })]);
    expect(plan.formats).not.toContain("probieren");
    expect(plan.worlds).not.toContain("zeit");
    expect(slotViolations(plan, { world: "erde", format: "warum", isStem: false, concept: "spuren!" })).toContain("Konzept kam bereits vor");
  });
  it("hält die Wissenswelten über das Fenster breit", () => {
    const recent = Array.from({ length: 9 }, (_, i) => issue(i, { world: i % 2 ? "sprache" : "erde" }));
    const plan = planNextSlot(recent);
    expect(plan.worlds).not.toContain("sprache");
    expect(plan.worlds).not.toContain("erde");
  });
  it("erkennt ein zu STEM-lastiges Fenster", () => {
    expect(rollingWindowsOk(Array.from({ length: 12 }, (_, i) => ({ isStem: i % 2 === 0 })))).toBe(false);
  });
  it("die simulierte Tagesfolge über ein Jahr bleibt im Rahmen", () => {
    const history: IssueFacts[] = [];
    for (let d = 0; d < 365; d++) {
      const plan = planNextSlot(history);
      const wantStem = plan.allowStem && d % 2 === 0;
      history.unshift(issue(d, { world: plan.worlds[0]!, format: plan.formats[d % plan.formats.length]!, isStem: wantStem, issueDate: `d${d}` }));
    }
    expect(rollingWindowsOk(history)).toBe(true);
    for (let i = 0; i + 10 <= history.length; i++) {
      const w = history.slice(i, i + 10);
      expect(new Set(w.filter((x) => !x.isStem).map((x) => x.world)).size).toBeGreaterThan(1);
    }
    for (let i = 1; i < history.length; i++) expect(history[i]!.format).not.toBe(history[i - 1]!.format);
  });
});

describe("Wiederholung", () => {
  const discovery = { postId: "alt", title: "Alt", confirmedAt: "2026-09-01" };
  it("braucht ein bestätigtes Thema", () => {
    expect(pickReview(Array.from({ length: 6 }, (_, i) => issue(i)), [])).toBeNull();
  });
  it("kommt etwa jede fünfte Ausgabe und referenziert das Bestätigte", () => {
    expect(pickReview(Array.from({ length: 6 }, (_, i) => issue(i)), [discovery])?.postId).toBe("alt");
    const justReviewed = Array.from({ length: 6 }, (_, i) => issue(i, { hasReview: i === 1 }));
    expect(pickReview(justReviewed, [discovery])).toBeNull();
  });
});
