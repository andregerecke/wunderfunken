import { expect, test, type Page } from "@playwright/test";

const FIXED = "warum-blaetter-bunt-werden";

async function stubSpeech(page: Page) {
  await page.addInitScript(() => {
    const log: string[] = [];
    let cancels = 0;
    (window as unknown as { __speech: () => object }).__speech = () => ({ log, cancels });
    class U { text; lang = ""; rate = 1; voice = null; onend: (() => void) | null = null; onerror = null; constructor(t: string) { this.text = t; } }
    (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = U;
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [], cancel: () => { cancels++; },
        speak: (u: U) => { log.push(u.text); const id = setTimeout(() => u.onend?.(), 30); void id; },
      },
    });
  });
}

test("Start zeigt Tageshäppchen mit Datum, Bild und Hauptaktion", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Jetzt entdecken" })).toBeVisible();
  await expect(page.getByText(/Letzte Ausgabe: \w+, \d+\. \w+ \d{4}/)).toBeVisible();
  await expect(page.getByText("Die nächste Ausgabe ist noch nicht fertig")).toBeVisible();
  const hero = page.locator(".hero-pic img");
  await expect(hero).toBeVisible();
  expect(await hero.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
});

test("Direktlink, Abschnitte und Zurück-Navigation", async ({ page }) => {
  await page.goto("/archiv");
  await page.getByRole("link", { name: "Ist ein Handschuh ein Schuh?" }).click();
  await expect(page).toHaveURL(/das-letzte-wort-entscheidet/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ist ein Handschuh ein Schuh?");
  for (const name of ["Der Wörter-Zug", "Wow!", "Was meinst du?", "Das merken wir uns"]) await expect(page.getByRole("heading", { name })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/archiv$/);
  await page.goto(`/wissen/${FIXED}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Blätter");
  const res = await page.goto("/wissen/gibt-es-nicht");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Dieses Häppchen gibt es nicht")).toBeVisible();
});

test("Lösung und Quellen sind eingeklappt", async ({ page }) => {
  await page.goto(`/wissen/${FIXED}`);
  const answer = page.getByText("Weil das kräftige Blattgrün es überdeckt");
  await expect(answer).toBeHidden();
  await page.getByText("Lösung für Große").click();
  await expect(answer).toBeVisible();
  await expect(page.getByRole("link", { name: "Herbstfärbung" })).toBeHidden();
});

test("Suche, kombinierte Filter, leere Ergebnisse und Zurücksetzen", async ({ page }) => {
  await page.goto("/archiv?q=herbst");
  await expect(page.getByText("1 Häppchen", { exact: true })).toBeVisible();
  await page.goto("/archiv");
  await page.getByRole("group", { name: "Wissenswelt" }).getByRole("link", { name: "Natur & Tiere" }).click();
  await expect(page).toHaveURL(/welt=natur/);
  await page.getByRole("group", { name: "Format" }).getByRole("link", { name: "Probier es aus!" }).click();
  await expect(page).toHaveURL(/welt=natur.*format=probieren|format=probieren.*welt=natur/);
  await expect(page.locator(".card")).toHaveCount(1);
  await page.goto("/archiv?q=raumschiffkuchen");
  await expect(page.getByText("Dazu haben wir noch nichts gefunden")).toBeVisible();
  await page.getByRole("link", { name: "Filter zurücksetzen" }).click();
  await expect(page).toHaveURL(/\/archiv$/);
  await expect(page.locator(".card")).toHaveCount(12);
  await page.getByRole("link", { name: "Weiter" }).click();
  await expect(page.locator(".card")).toHaveCount(12);
});

test("Überrasch mich führt zu einem Beitrag", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Überrasch mich" }).click();
  await expect(page).toHaveURL(/\/wissen\//);
});

test("Merken ist unabhängig vom Entdeckerstatus und bleibt nach dem Neuladen", async ({ page }) => {
  await page.goto(`/wissen/${FIXED}`);
  await page.getByRole("button", { name: /merken$/ }).first().click();
  await expect(page.getByText("Gemerkt")).toBeVisible();
  await page.goto("/merkliste");
  await expect(page.getByRole("heading", { name: "Warum werden die Blätter bunt?" })).toBeVisible();
  await expect(page.getByText("Hier erscheinen Themen")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Warum werden die Blätter bunt?" })).toBeVisible();
  await page.getByRole("button", { name: /von der Merkliste nehmen/ }).click();
  await expect(page.getByText("Noch nichts gemerkt")).toBeVisible();
});

test("Öffnen zählt nicht, Bestätigen und Zurücknehmen schon", async ({ page }) => {
  await page.goto(`/wissen/${FIXED}`);
  await page.goto("/merkliste");
  await expect(page.getByText("Hier erscheinen Themen")).toBeVisible();
  await page.goto(`/wissen/${FIXED}`);
  await page.getByRole("button", { name: "Gemeinsam entdeckt" }).click();
  await expect(page.getByText(/Gemeinsam entdeckt am/)).toBeVisible();
  await page.goto("/merkliste");
  await expect(page.locator(".history li")).toHaveCount(1);
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.locator(".history li")).toHaveCount(0);
});

test("Vorlesen startet nur bewusst, stoppt beim Wechsel und lässt die Lösung aus", async ({ page }) => {
  await stubSpeech(page);
  await page.goto(`/wissen/${FIXED}`);
  const speech = () => page.evaluate(() => (window as unknown as { __speech: () => { log: string[]; cancels: number } }).__speech());
  expect((await speech()).log).toHaveLength(0);
  await page.locator(".actionbar").getByRole("button", { name: "Vorlesen" }).click();
  await expect.poll(async () => (await speech()).log.length).toBeGreaterThan(3);
  const before = await speech();
  await page.locator(".actionbar").getByRole("button", { name: "Pause" }).click();
  await page.locator(".actionbar").getByRole("button", { name: "Stopp" }).click();
  await page.locator(".actionbar").getByRole("button", { name: "Vorlesen" }).click();
  await page.locator("a.back").click();
  await expect(page).toHaveURL(/\/$/);
  const after = await speech();
  expect(after.cancels).toBeGreaterThan(before.cancels);
  const count = after.log.length;
  await page.waitForTimeout(150);
  expect((await speech()).log.length).toBe(count);
  const spoken = after.log.join(" ");
  expect(spoken).not.toContain("Weil das kräftige Blattgrün es überdeckt");
  expect(spoken).not.toContain("Gesprächsimpuls");
  expect(spoken).not.toContain("wikipedia");
});

test("Kein Überlauf, kleine Ziele oder defekte Bilder", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errors.push(m.text()); });
  for (const path of ["/", `/wissen/${FIXED}`, "/archiv", "/merkliste", "/fuer-grosse"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const r = await page.evaluate(async () => {
      for (const i of document.images) { i.loading = "eager"; await i.decode().catch(() => undefined); }
      const small = [...document.querySelectorAll<HTMLElement>("a.btn, button, .chip, .nav a, summary")].filter((e) => e.offsetParent && e.getBoundingClientRect().height < 43).map((e) => e.textContent);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, small,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      };
    });
    expect(r.overflow, path).toBeLessThanOrEqual(0);
    expect(r.small, path).toEqual([]);
    expect(r.broken, path).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("Tastatur erreicht Hauptaktion mit sichtbarem Fokus", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "Safari überspringt Links per Tab standardmäßig");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Zum Inhalt springen" })).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    if (await page.getByRole("link", { name: "Jetzt entdecken" }).evaluate((e) => e === document.activeElement)) return;
  }
  throw new Error("Hauptaktion nicht per Tastatur erreicht");
});
