import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SEED_POSTS } from "@/content/seed";
import { MAX_SEED_STEM, rollingWindowsOk } from "@/domain/mix";
import { spokenParts } from "@/domain/post";
import { contentViolations, safetyViolations } from "@/domain/safety";
import { WORLDS } from "@/domain/worlds";

function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
};

describe("Startbestand", () => {
  it("hat mindestens 24 verschiedene Beiträge", () => {
    expect(SEED_POSTS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(SEED_POSTS.map((p) => p.slug)).size).toBe(SEED_POSTS.length);
    expect(new Set(SEED_POSTS.map((p) => p.concept)).size).toBe(SEED_POSTS.length);
  });
  it.each(SEED_POSTS.map((p) => [p.slug, p] as const))("%s ist vollständig, sicher und bebildert", (_, post) => {
    expect(contentViolations(post)).toEqual([]);
    expect(post.sources.length).toBeGreaterThan(0);
    const file = path.join("public", post.image.src);
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toContain("<svg");
  });
  it("hält den Themenmix ein", () => {
    const stem = SEED_POSTS.filter((p) => p.stem.isStem).length;
    expect(stem).toBeLessThanOrEqual(MAX_SEED_STEM);
    expect(rollingWindowsOk(SEED_POSTS.map((p) => ({ isStem: p.stem.isStem })))).toBe(true);
    expect(new Set(SEED_POSTS.map((p) => p.world)).size).toBeGreaterThanOrEqual(10);
  });
  it("wiederholt Format und Welt nie direkt", () => {
    SEED_POSTS.slice(1).forEach((p, i) => {
      expect(p.format).not.toBe(SEED_POSTS[i]!.format);
      expect(p.world).not.toBe(SEED_POSTS[i]!.world);
    });
  });
  it("liest weder Lösung noch Quellen vor", () => {
    for (const post of SEED_POSTS) {
      const spoken = spokenParts(post).join(" ");
      expect(spoken).not.toContain(post.check.answer);
      expect(spoken).not.toContain(post.check.parentPrompt);
      expect(spoken).not.toContain(post.sources[0]!.url);
    }
  });
});

describe("Sicherheitsregeln", () => {
  const activity = (steps: string[], materials: string[] = []) => ({ activity: { title: "Versuch", materials, steps } });
  it.each([
    ["Zündet eine Kerze an.", "Hitze oder Feuer"], ["Steckt es in die Steckdose.", "Netzstrom"],
    ["Halte die Luft so lange an.", "Atemanhalten"], ["Nimm einen kleinen Magneten.", "Knopfzellen oder Magnete"],
    ["Klettere auf den Baum.", "Klettern"],
  ])("sperrt: %s", (text, why) => expect(safetyViolations(activity([text]))).toContain(why));
  it("lässt harmlose Aktivitäten durch", () => expect(safetyViolations(activity(["Malt zwei Bilder."], ["Papier"]))).toEqual([]));
});

describe("Kontraste", () => {
  it.each(Object.entries(WORLDS))("%s ist auf seiner Fläche lesbar", (_, w) => expect(contrast(w.color, w.tint)).toBeGreaterThanOrEqual(4.5));
  it.each([["#243E35", "#F8F6EF"], ["#AD4319", "#F8F6EF"], ["#4A5F56", "#F8F6EF"], ["#FFFFFF", "#2B5141"], ["#2B5141", "#EAF0E3"], ["#AD4319", "#FBEED9"]])("%s auf %s", (a, b) => {
    expect(contrast(a, b)).toBeGreaterThanOrEqual(4.5);
  });
});
