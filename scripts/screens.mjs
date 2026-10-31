import { chromium, webkit } from "@playwright/test";
const out = "docs/screenshots";
const base = "http://localhost:3100";
const shots = [["start", "/"], ["haeppchen", "/wissen/warum-blaetter-bunt-werden"], ["archiv", "/archiv?welt=natur"], ["fuer-grosse", "/fuer-grosse"]];
for (const [label, type, w, h, full] of [["390", chromium, 390, 844, true], ["1360", chromium, 1360, 900, true], ["390-webkit", webkit, 390, 844, false], ["360", chromium, 360, 740, false], ["820", chromium, 820, 1180, false]]) {
  const b = await type.launch(); const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const [name, path] of shots) {
    await p.goto(base + path); await p.waitForLoadState("networkidle");
    await p.evaluate(() => { for (const i of document.images) i.loading = "eager"; }); await p.waitForTimeout(250);
    await p.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: full });
  }
  await b.close();
}
