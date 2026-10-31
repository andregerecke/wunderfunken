// Zeichnet den Startbestand als eigene SVG-Illustrationen (1200×800). Lauf: npm run illustrations
import { writeFileSync } from "node:fs";

const C = { sky: "#CFE6E4", skyW: "#FBE3BE", dusk: "#27375E", grass: "#A9CB84", grass2: "#8DB768", earth: "#C89B6C", earth2: "#A87B50", earth3: "#7E5A3C", water: "#7FBFD1", water2: "#5EA7BE", sun: "#F6B93B", coral: "#DF693E", red: "#D2483A", green: "#2B5141", leaf: "#5E9A4B", yellow: "#F2C230", orange: "#EC8A2E", cream: "#FFF9EC", wood: "#B0784A", wood2: "#8A5A34", ink: "#243E35", white: "#FFFFFF", blue: "#3F78B5", plum: "#7B3F86", grey: "#A9B4B0", pink: "#F3A6A0" };
const SKINS = ["#F6CFA9", "#D9A06F", "#8E5A3A", "#EFC19A"];

const svg = (title, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img"><title>${title}</title>${body}</svg>\n`;
const rect = (x, y, w, h, f, r = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`;
const circ = (x, y, r, f, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${extra}/>`;
const ell = (x, y, a, b, f, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${f}" ${extra}/>`;
const path = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
const line = (d, c = C.ink, w = 6, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const dashed = (d, c = C.ink, w = 5) => line(d, c, w, 'stroke-dasharray="4 16"');
const g = (t, b) => `<g transform="${t}">${b}</g>`;
const text = (x, y, s, size, f = C.ink) => `<text x="${x}" y="${y}" font-family="Georgia, serif" font-weight="700" font-size="${size}" text-anchor="middle" fill="${f}">${s}</text>`;
function arrow(x1, y1, x2, y2, c = C.ink, w = 6) {
  const a = Math.atan2(y2 - y1, x2 - x1), l = 20;
  const p = (d) => `${x2 - l * Math.cos(a + d)} ${y2 - l * Math.sin(a + d)}`;
  return line(`M${x1} ${y1} L${x2} ${y2} M${p(0.5)} L${x2} ${y2} L${p(-0.5)}`, c, w);
}
const scene = (sky = C.sky, ground = C.grass, y = 560) => rect(0, 0, 1200, 800, sky) + path(`M0 ${y} Q300 ${y - 50} 620 ${y - 10} T1200 ${y - 20} V800 H0Z`, ground);
const sun = (x, y, r = 60) => circ(x, y, r * 1.45, C.sun, 'opacity=".25"') + circ(x, y, r, C.sun);
const cloud = (x, y, s = 1, f = C.white) => g(`translate(${x} ${y}) scale(${s})`, ell(0, 0, 70, 34, f) + ell(-40, 8, 44, 26, f) + ell(44, 10, 48, 26, f) + ell(6, -22, 44, 30, f));
const tree = (x, y, s = 1, f = C.leaf) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -110, 28, 110, C.wood2, 8) + ell(0, -170, 90, 86, f) + ell(-54, -130, 54, 46, f) + ell(54, -130, 54, 46, f));
const heart = (x, y, s, f = C.red) => g(`translate(${x} ${y}) scale(${s})`, path("M0 30 C-50 -6 -34 -46 0 -22 C34 -46 50 -6 0 30Z", f));

// Kinderfigur: Füße bei (x,y). mood: smile | worry | wow
function kid(x, y, { s = 1, skin = 0, shirt = C.coral, pants = C.green, hair = C.earth3, long = false, mood = "smile", armL = "M-34 -118 L-62 -74", armR = "M34 -118 L62 -74" } = {}) {
  const k = SKINS[skin];
  const mouth = mood === "worry" ? line("M-9 -192 Q0 -200 9 -192", C.ink, 3.5) : mood === "wow" ? ell(0, -194, 6, 8, C.ink) : line("M-11 -197 Q0 -186 11 -197", C.ink, 3.5);
  return g(`translate(${x} ${y}) scale(${s})`,
    (long ? path("M-40 -220 Q-52 -150 -30 -140 L30 -140 Q52 -150 40 -220Z", hair) : "") +
    rect(-27, -66, 22, 66, pants, 10) + rect(5, -66, 22, 66, pants, 10) +
    ell(-16, -2, 20, 9, C.ink) + ell(16, -2, 20, 9, C.ink) +
    line(armL, k, 15) + line(armR, k, 15) +
    rect(-36, -146, 72, 94, shirt, 22) +
    circ(0, -210, 40, k) +
    path("M-41 -214 Q-36 -258 0 -254 Q36 -258 41 -214 Q18 -236 -6 -232 Q-26 -232 -41 -214Z", hair) +
    circ(-14, -212, 4, C.ink) + circ(14, -212, 4, C.ink) + circ(-24, -198, 7, C.pink, 'opacity=".6"') + circ(24, -198, 7, C.pink, 'opacity=".6"') + mouth);
}
const adult = (x, y, o = {}) => g(`translate(${x} ${y}) scale(1.35)`, kid(0, 0, { shirt: C.blue, pants: C.earth3, ...o }));

function bigLeaf(x, y, s, base, vein, extra = "") {
  return g(`translate(${x} ${y}) scale(${s}) rotate(-16)`,
    path("M0 -190 C110 -130 130 40 0 170 C-130 40 -110 -130 0 -190Z", base) + extra +
    line("M0 -170 L0 230", vein, 9) + line("M0 -60 L62 -110 M0 -60 L-62 -110 M0 20 L74 -32 M0 20 L-74 -32 M0 94 L56 50 M0 94 L-56 50", vein, 6));
}

const out = {};

out["warum-blaetter-bunt-werden"] = scene(C.skyW, "#E9C78F", 690) + sun(120, 110, 56) +
  dashed("M210 170 Q300 200 360 230", C.orange) +
  bigLeaf(235, 410, 1.05, C.leaf, C.green) +
  bigLeaf(600, 410, 1.05, C.yellow, "#A9872A", path("M0 -190 C60 -150 40 -40 0 170 C-40 -40 -60 -150 0 -190Z", C.leaf) + ell(-44, -70, 12, 22, C.leaf) + ell(46, -30, 11, 20, C.leaf)) +
  bigLeaf(965, 410, 1.05, C.orange, "#A9531C", ell(-32, -40, 30, 62, C.yellow) + ell(38, 40, 28, 56, C.yellow)) +
  arrow(405, 400, 455, 400, C.ink, 8) + arrow(770, 400, 820, 400, C.ink, 8) +
  ell(1090, 720, 32, 12, C.orange) + ell(1020, 740, 30, 11, C.yellow) + ell(150, 735, 30, 11, C.yellow);

function wagon(x, w, c, crown) {
  return rect(x, 300, w, 150, c, 18) + circ(x + 50, 470, 30, C.ink) + circ(x + w - 50, 470, 30, C.ink) + circ(x + 50, 470, 12, C.grey) + circ(x + w - 50, 470, 12, C.grey) +
    (crown ? g(`translate(${x + w / 2} 262)`, path("M-46 28 L-54 -22 L-24 2 L0 -34 L24 2 L54 -22 L46 28Z", C.yellow)) : "");
}
const hand = g("translate(430 378) scale(1.1)", path("M-40 50 Q-50 0 -36 -30 Q-28 -40 -24 -24 L-20 -56 Q-12 -66 -6 -54 L-2 -64 Q8 -72 12 -58 L18 -50 Q28 -56 30 -42 L32 -20 Q52 -34 56 -18 Q48 10 30 50Z", SKINS[0]));
const shoe = g("translate(760 395)", path("M-90 30 Q-92 -36 -66 -42 Q-40 -44 -36 -24 Q-6 -8 44 -2 Q84 6 84 32 Q0 44 -90 30Z", C.coral) + rect(-92, 28, 178, 14, C.ink, 7) + line("M-24 -18 L-10 -30 M-8 -10 L6 -22", C.cream, 5));
const rails = rect(0, 500, 1200, 12, C.wood2) + Array.from({ length: 16 }, (_, i) => rect(i * 82, 512, 40, 16, C.wood)).join("");
out["das-letzte-wort-entscheidet"] = scene(C.sky, C.grass, 540) + cloud(190, 130) + cloud(960, 110, .8) + rails +
  rect(70, 310, 190, 140, C.green, 20) + rect(120, 240, 100, 90, C.green, 12) + rect(92, 200, 40, 70, C.ink, 8) + circ(120, 470, 34, C.ink) + circ(220, 470, 34, C.ink) + rect(140, 262, 60, 44, C.sky, 8) + cloud(90, 150, .4) +
  rect(255, 400, 60, 12, C.ink) + wagon(310, 240, C.yellow) + hand + rect(545, 400, 60, 12, C.ink) + wagon(600, 330, C.cream, true) + shoe;

function greetPair(x, y, kind) {
  const bg = { hand: "#FBE8DC", bow: "#DFF0F1", nam: "#F3E5F4", nose: "#E7F0DC" }[kind];
  let b = rect(x, y, 540, 330, bg, 26);
  const fx = x + 170, fy = y + 310, gx = x + 370;
  if (kind === "hand") b += kid(fx, fy, { s: 1, shirt: C.coral, armR: "M34 -118 L100 -106" }) + kid(gx, fy, { s: 1, skin: 1, shirt: C.blue, armL: "M-34 -118 L-100 -106" }) ;
  if (kind === "bow") b += g(`translate(${x + 130} ${fy})`, g("rotate(17)", kid(0, 0, { skin: 3, shirt: C.plum, hair: C.ink, armL: "M-34 -118 L-40 -60", armR: "M34 -118 L40 -60" }))) + g(`translate(${x + 410} ${fy})`, g("rotate(-17)", kid(0, 0, { skin: 3, shirt: C.leaf, hair: C.ink, armL: "M-34 -118 L-40 -60", armR: "M34 -118 L40 -60" })));
  if (kind === "nam") b += kid(fx, fy, { skin: 1, shirt: C.yellow, hair: C.ink, long: true, armL: "M-34 -118 L0 -126", armR: "M34 -118 L0 -126" }) + ell(fx, fy - 142, 12, 26, SKINS[1]) + line(`M${fx - 30} ${fy - 118} L${fx - 8} ${fy - 128} M${fx + 30} ${fy - 118} L${fx + 8} ${fy - 128}`, SKINS[1], 14) + kid(gx, fy, { skin: 2, shirt: C.orange, hair: C.ink, armL: "M-34 -118 L0 -126", armR: "M34 -118 L0 -126" }) + ell(gx, fy - 142, 12, 26, SKINS[2]) + line(`M${gx - 30} ${fy - 118} L${gx - 8} ${fy - 128} M${gx + 30} ${fy - 118} L${gx + 8} ${fy - 128}`, SKINS[2], 14);
  if (kind === "nose") b += g(`translate(${x + 212} ${fy})`, g("rotate(10 0 -60)", kid(0, 0, { skin: 2, shirt: C.green, hair: C.ink }))) + g(`translate(${x + 328} ${fy})`, g("rotate(-10 0 -60)", kid(0, 0, { skin: 1, shirt: C.coral, hair: C.ink, long: true })));
  return b;
}
out["hallo-auf-der-ganzen-welt"] = rect(0, 0, 1200, 800, C.cream) + greetPair(40, 45, "hand") + greetPair(620, 45, "bow") + greetPair(40, 420, "nam") + greetPair(620, 420, "nose");

out["gesehen-oder-gedacht"] = rect(0, 0, 1200, 800, C.sky) + rect(0, 470, 1200, 330, "#8C949A") + rect(0, 455, 1200, 22, C.grey) +
  line("M0 640 H1200", C.cream, 10, 'stroke-dasharray="70 60"') +
  ell(600, 620, 230, 74, C.water2) + ell(560, 610, 130, 36, C.water) + 
  cloud(240, 190, 1.5, "#8A9AAA") + line("M180 280 L168 330 M240 290 L228 340 M300 280 L288 330", C.water2, 8) +
  g("translate(910 470)", rect(-170, -130, 250, 150, C.yellow, 22) + rect(70, -90, 110, 110, C.orange, 18) + rect(90, -74, 70, 46, C.sky, 8) + circ(-110, 26, 36, C.ink) + circ(120, 26, 36, C.ink) + circ(-110, 26, 14, C.grey) + circ(120, 26, 14, C.grey) + line("M-180 10 L-250 70 M-170 22 L-230 96 M-180 -6 L-262 36", C.water2, 8)) +
  text(330, 470, "?", 110, C.coral) + text(690, 440, "?", 110, C.coral) +
  dashed("M340 490 Q400 540 470 570") + dashed("M680 460 L640 545");

const tableSide = rect(120, 380, 240, 22, C.wood, 8) + rect(140, 400, 18, 130, C.wood2) + rect(322, 400, 18, 130, C.wood2);
const bedSide = rect(380, 450, 200, 54, "#BFD4E8", 14) + rect(380, 500, 200, 22, C.wood2, 6) + rect(380, 420, 18, 110, C.wood2) + ell(420, 442, 34, 16, C.cream);
const chairSide = rect(55, 440, 62, 14, C.wood, 6) + rect(58, 360, 12, 170, C.wood2) + rect(104, 450, 12, 80, C.wood2);
out["die-welt-von-oben"] = rect(0, 0, 600, 800, "#F6EDCF") + rect(0, 530, 600, 270, C.earth) + chairSide + tableSide + bedSide +
  rect(600, 0, 600, 800, "#EAF0E3") + rect(672, 120, 460, 560, C.cream, 12, `stroke="${C.ink}" stroke-width="6"`) +
  rect(712, 180, 90, 82, C.wood, 8) + rect(830, 170, 170, 110, C.wood, 8) + rect(780, 420, 300, 150, "#BFD4E8", 12) + rect(780, 420, 72, 150, C.cream, 12) +
    dashed("M90 370 C200 180 500 170 757 215", C.coral) + dashed("M240 370 C340 260 620 200 915 225", C.leaf) + dashed("M480 420 C600 560 700 560 800 500", C.blue);

function basket(x, y, c) {
  return path(`M${x - 190} ${y} L${x - 150} ${y + 190} Q${x} ${y + 220} ${x + 150} ${y + 190} L${x + 190} ${y}Z`, c) + rect(x - 200, y - 16, 400, 30, C.wood2, 14) +
    line(`M${x - 130} ${y + 40} L${x - 100} ${y + 180} M${x} ${y + 40} L${x} ${y + 190} M${x + 130} ${y + 40} L${x + 100} ${y + 180}`, C.wood2, 5);
}
const glass = (x, y) => path(`M${x - 34} ${y - 100} L${x - 24} ${y} H${x + 24} L${x + 34} ${y - 100}Z`, "#D5ECF2") + path(`M${x - 28} ${y - 60} L${x - 24} ${y} H${x + 24} L${x + 28} ${y - 60}Z`, C.water);
const bread = (x, y) => ell(x, y - 40, 72, 44, C.earth) + line(`M${x - 34} ${y - 66} l18 30 M${x} ${y - 72} l18 30 M${x + 34} ${y - 66} l14 26`, C.earth2, 5);
const bed = (x, y) => rect(x - 70, y - 40, 140, 36, "#BFD4E8", 10) + rect(x - 76, y - 12, 152, 14, C.wood2, 6) + ell(x - 44, y - 46, 26, 12, C.cream);
const icecream = (x, y) => path(`M${x - 34} ${y - 100} L${x} ${y} L${x + 34} ${y - 100}Z`, C.earth) + circ(x, y - 124, 40, C.pink) + circ(x + 8, y - 174, 30, C.yellow);
const teddy = (x, y) => circ(x - 34, y - 130, 18, C.earth2) + circ(x + 34, y - 130, 18, C.earth2) + circ(x, y - 104, 44, C.earth2) + ell(x, y - 36, 46, 48, C.earth2) + circ(x - 14, y - 110, 4, C.ink) + circ(x + 14, y - 110, 4, C.ink) + ell(x, y - 94, 12, 9, C.cream);
const skate = (x, y) => path(`M${x - 50} ${y - 20} L${x - 50} ${y - 90} H${x - 6} L${x + 4} ${y - 50} Q${x + 60} ${y - 44} ${x + 60} ${y - 20}Z`, C.red) + circ(x - 34, y - 6, 14, C.ink) + circ(x + 38, y - 6, 14, C.ink);
out["brauchen-oder-wollen"] = rect(0, 0, 1200, 800, "#F3EFE2") + rect(0, 660, 1200, 140, C.earth) +
  heart(190, 330, 1.7) + glass(340, 400) + bread(200, 432) + bed(350, 430) +
  icecream(800, 430) + teddy(930, 432) + skate(1040, 410) +
  basket(285, 430, C.earth) + basket(915, 430, "#D9B785");

const carousel = rect(590, 200, 20, 300, C.wood2) + path("M430 240 L600 120 L770 240Z", C.coral) + rect(420, 236, 360, 24, C.yellow, 12) + rect(460, 256, 8, 170, C.grey) + rect(732, 256, 8, 170, C.grey) + ell(600, 500, 200, 34, C.wood) +
  g("translate(464 450)", ell(0, 0, 54, 26, C.white) + circ(46, -24, 22, C.white) + rect(-34, 10, 10, 34, C.white) + rect(26, 10, 10, 34, C.white) + rect(-20, -34, 40, 14, C.red, 6)) +
  g("translate(736 450) scale(-1 1)", ell(0, 0, 54, 26, C.yellow) + circ(46, -24, 22, C.yellow) + rect(-34, 10, 10, 34, C.yellow) + rect(26, 10, 10, 34, C.yellow) + rect(-20, -34, 40, 14, C.blue, 6));
out["gleiche-sache-anderes-gefuehl"] = scene("#E8EEDF", C.grass, 560) + carousel +
  kid(210, 700, { s: 1.15, armL: "M-34 -118 L-60 -180", armR: "M34 -118 L60 -180", long: true }) +
  kid(990, 700, { s: 1.15, skin: 2, shirt: C.blue, hair: C.ink, mood: "worry", armL: "M-34 -118 L-6 -94", armR: "M34 -118 L6 -94" }) +
  ell(210, 225, 120, 76, C.cream) + sun(210, 225, 42) + circ(150, 318, 12, C.cream) + circ(176, 342, 7, C.cream) +
  ell(990, 225, 120, 76, C.cream) + cloud(990, 225, .9, "#8A9AAA") + path("M992 250 L970 300 L992 292 L976 336 L1018 278 L994 286Z", C.yellow) + circ(1040, 318, 12, C.cream) + circ(1016, 342, 7, C.cream);

out["spuren-aus-der-vergangenheit"] = rect(0, 0, 1200, 180, C.sky) + path("M0 180 Q600 130 1200 180 V270 H0Z", C.grass) + tree(1000, 190, .7) + cloud(240, 70, .7) +
  rect(0, 260, 1200, 170, C.earth) + rect(0, 430, 1200, 170, C.earth2) + rect(0, 600, 1200, 200, C.earth3) +
  g("translate(330 345)", rect(-70, -20, 140, 44, C.red, 14) + rect(-34, -48, 76, 40, C.red, 12) + circ(-40, 28, 15, C.ink) + circ(40, 28, 15, C.ink)) +
  g("translate(800 350)", ell(0, 0, 38, 12, C.grey) + ell(90, 16, 34, 11, C.ink)) +
  g("translate(420 515)", path("M-46 -60 H46 L38 -36 Q72 10 40 60 H-40 Q-72 10 -38 -36Z", "#C7704A") + line("M-52 -8 H52", C.cream, 5)) +
  g("translate(770 520)", circ(0, 0, 46, C.yellow) + circ(0, 0, 32, "none", `stroke="#A9872A" stroke-width="5"`) + text(0, 15, "I", 42, "#A9872A")) +
  g("translate(600 700) rotate(-14)", path("M-120 30 L-30 -46 L120 -12 L90 34 Z", C.grey) + line("M-60 -6 L60 8", "#79857F", 5)) + 
  line("M1100 290 V760", C.cream, 6) + arrow(1100, 700, 1100, 770, C.cream, 6);

const bead = (x, c) => circ(x, 190, 46, c) + circ(x - 14, 174, 12, C.white, 'opacity=".5"');
const blocks = (x, n) => Array.from({ length: n }, (_, i) => rect(x, 690 - (i + 1) * 46, 110, 44, C.blue, 8)).join("");
out["muster-sagen-was-kommt"] = rect(0, 0, 1200, 800, "#EAF0E3") + line("M30 190 H1170", C.ink, 4) +
  [C.red, C.blue, C.blue, C.red, C.blue, C.blue, C.red].map((c, i) => bead(90 + i * 142, c)).join("") + circ(1094, 190, 46, C.cream, `stroke="${C.ink}" stroke-width="5" stroke-dasharray="6 10"`) + text(1094, 216, "?", 70, C.coral) +
  rect(100, 690, 1000, 20, C.wood2, 6) + blocks(190, 2) + blocks(420, 4) + blocks(650, 6) +
  rect(880, 280, 110, 410, "none", 8, `stroke="${C.coral}" stroke-width="6" stroke-dasharray="14 12"`) + text(935, 500, "?", 110, C.coral);

const diya = (x, y) => path(`M${x - 44} ${y} Q${x} ${y + 44} ${x + 44} ${y} Q${x} ${y + 12} ${x - 44} ${y}Z`, C.earth) + ell(x, y - 18, 11, 22, C.yellow) + ell(x, y - 14, 5, 12, C.white);
const star = (x, y, r = 3) => circ(x, y, r, C.cream);
const menorah = g("translate(600 620)", rect(-10, -210, 20, 210, C.yellow) + rect(-90, 0, 180, 20, C.yellow, 8) +
  [-160, -120, -80, -40, 40, 80, 120, 160].map((d) => line(`M0 -60 Q${d} -60 ${d} -190`, C.yellow, 9)).join("") +
  [-160, -120, -80, -40, 40, 80, 120, 160].map((d) => ell(d, -212, 8, 16, C.orange)).join("") + rect(-6, -270, 12, 60, C.cream) + ell(0, -288, 10, 18, C.orange));
const lantern = g("translate(960 300)", line("M0 -60 L0 -30 M-120 -60 Q0 -130 120 -60", C.wood, 8) + circ(0, 50, 86, C.orange) + path("M-85 40 H85 M-68 0 H68 M-68 100 H68", C.red, `stroke="${C.red}" stroke-width="5"`) + circ(0, 50, 86, C.yellow, 'opacity=".35"') + path("M0 8 L12 36 L42 38 L18 56 L26 86 L0 70 L-26 86 L-18 56 L-42 38 L-12 36Z", C.cream));
out["feste-des-lichts"] = rect(0, 0, 1200, 800, C.dusk) + [[80, 80], [260, 150], [420, 60], [700, 110], [900, 70], [1120, 140], [1040, 40], [560, 190], [140, 250]].map(([x, y]) => star(x, y, 4)).join("") +
  circ(1090, 110, 54, C.cream) + circ(1112, 96, 48, C.dusk) + rect(0, 650, 1200, 150, "#1D2B4B") + diya(120, 640) + diya(230, 610) + diya(340, 640) + diya(175, 700) + diya(285, 710) + menorah + lantern + rect(800, 630, 320, 22, C.earth3, 10) ;

const swing = rect(170, 110, 450, 24, C.wood2, 12) + line("M190 130 L120 690 M600 130 L670 690", C.wood2, 18) + line("M330 130 L300 470 M470 130 L440 470", C.ink, 5) + rect(280, 464, 180, 18, C.wood, 8);
out["abwechseln-ist-fair"] = scene("#E3EEDF", C.grass, 610) + sun(1080, 100, 46) + swing +
  g("translate(370 590)", kid(0, 0, { armL: "M-34 -118 L-40 -200", armR: "M34 -118 L40 -200", long: true })) +
  kid(960, 720, { s: 1.15, skin: 1, shirt: C.blue, hair: C.ink }) +
  g("translate(720 300)", rect(-70, -96, 140, 16, C.wood2, 8) + rect(-70, 80, 140, 16, C.wood2, 8) + path("M-54 -80 H54 Q50 -26 8 0 Q50 26 54 80 H-54 Q-50 26 -8 0 Q-50 -26 -54 -80Z", C.cream) + path("M-34 -44 H34 Q24 -22 0 -4 Q-24 -22 -34 -44Z", C.yellow) + path("M-38 76 Q0 34 38 76Z", C.yellow)) +
  line("M560 560 Q720 680 880 560", C.coral, 8) + line("M880 540 Q720 440 620 490", C.coral, 8, 'stroke-dasharray="1 0"') + arrow(830, 590, 880, 560, C.coral, 8) + arrow(680, 462, 620, 490, C.coral, 8);

function row(y, a, b) { return a + b + text(600, y + 20, "=", 80, C.coral); }
const mouseAnimal = g("translate(330 0)", ell(0, 0, 70, 44, C.grey) + circ(66, -26, 26, C.grey) + circ(52, -52, 18, C.pink) + circ(78, -28, 4, C.ink) + line("M-66 8 Q-130 10 -130 60", C.pink, 7));
const mouseComputer = g("translate(860 0)", ell(0, 0, 54, 78, "#DCE3E0") + line("M0 -78 L0 -24", C.ink, 5) + rect(-7, -56, 14, 28, C.blue, 6) + line("M0 -78 Q0 -130 80 -130", C.ink, 6));
const parkBench = g("translate(330 0)", rect(-120, -30, 240, 24, C.wood, 6) + rect(-120, -80, 240, 22, C.wood, 6) + rect(-100, -10, 16, 66, C.ink) + rect(84, -10, 16, 66, C.ink));
const bankBuilding = g("translate(860 0)", path("M-120 -40 L0 -100 L120 -40Z", C.grey) + rect(-120, 50, 240, 16, C.grey) + [-90, -30, 30, 90].map((x) => rect(x - 12, -36, 24, 88, "#DCE3E0")).join("") + circ(0, -60, 15, C.yellow));
const padlock = g("translate(330 0)", line("M-46 -20 V-60 Q-46 -108 0 -108 Q46 -108 46 -60 V-20", C.grey, 18) + rect(-74, -24, 148, 100, C.yellow, 16) + circ(0, 18, 14, C.ink) + rect(-5, 18, 10, 32, C.ink));
const castle = g("translate(860 0)", rect(-110, -40, 220, 116, C.earth) + rect(-140, -90, 60, 166, C.earth2) + rect(80, -90, 60, 166, C.earth2) + path("M-150 -90 L-110 -140 L-70 -90Z", C.red) + path("M70 -90 L110 -140 L150 -90Z", C.red) + path("M-30 76 V20 Q0 -14 30 20 V76Z", C.ink));
out["teekesselchen"] = rect(0, 0, 1200, 800, "#FBF3E2") + rect(70, 40, 1060, 220, "#F6EDCF", 22) + rect(70, 290, 1060, 220, "#DFF0F1", 22) + rect(70, 540, 1060, 220, "#E7F0DC", 22) +
  g("translate(0 170)", row(0, parkBench, bankBuilding)) + g("translate(0 410)", row(0, mouseAnimal, mouseComputer)) + g("translate(0 640)", row(0, padlock, castle));

const shade = (x, y, dx) => path(`M${x - 24} ${y} L${x + dx - 26} ${y + 34} L${x + dx + 26} ${y + 34} L${x + 24} ${y}Z`, "#5F8050", 'opacity=".8"');
out["der-wandernde-schatten"] = scene("#D7ECEA", C.grass, 500) +
  path("M120 470 Q600 -180 1080 470", "none", `stroke="${C.orange}" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round"`) + sun(120, 450, 44) + sun(600, 110, 58) + sun(1080, 450, 44) +
  shade(250, 690, 230) + kid(250, 690, { s: .95, long: true }) + shade(600, 690, 18) + kid(600, 690, { s: .95, long: true }) + shade(960, 690, -230) + kid(960, 690, { s: .95, long: true });

const house = (x, y, c, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-34, -50, 68, 56, c, 4) + path("M-44 -48 L0 -92 L44 -48Z", C.red) + rect(-9, -24, 18, 30, C.ink, 3));
const river = path("M430 0 C340 170 600 220 560 380 C520 520 280 540 340 800 H660 C600 560 800 500 800 360 C820 200 580 150 650 0Z", C.water) + line("M520 60 q30 18 60 0 M640 300 q30 18 60 0 M460 640 q30 18 60 0", C.white, 5, 'opacity=".7"');
out["warum-staedte-an-fluessen-liegen"] = rect(0, 0, 1200, 800, C.grass) + river +
  [[120, 90], [230, 120], [120, 200], [240, 240], [340, 150], [160, 310], [300, 340]].map(([x, y], i) => house(x, y, [C.cream, "#F6D7B0", "#F3E3C9"][i % 3], 1.15)).join("") +
  rect(880, 80, 270, 240, "#CFDD9B", 12) + rect(880, 340, 270, 180, C.yellow, 12) + line("M910 90 V310 M960 90 V310 M1010 90 V310 M1060 90 V310 M1110 90 V310", C.grass2, 8) +
  rect(290, 372, 620, 40, C.wood, 8) + [370, 470, 730, 830].map((x) => rect(x, 412, 16, 40, C.wood2)).join("") +
  g("translate(570 620)", path("M-100 0 H100 L70 54 H-70Z", C.wood2) + rect(-60, -40, 50, 40, C.yellow, 4) + rect(4, -40, 50, 40, C.coral, 4) + rect(-4, -130, 8, 90, C.ink) + path("M4 -130 L70 -60 H4Z", C.cream)) +
  g("translate(190 650)", tree(0, 60, .7)) + g("translate(980 720)", tree(0, 60, .7));

out["wenn-ich-das-nehme"] = scene(C.sky, C.grass, 420) + cloud(180, 110, .9) + cloud(1000, 90, .8) +
  path("M520 800 L560 560 Q570 480 330 380 L260 380 Q430 470 400 560 L280 800Z", "#E9D5A6") + path("M680 800 L640 560 Q630 480 870 380 L940 380 Q770 470 800 560 L920 800Z", "#E9D5A6") + path("M280 800 L400 600 H800 L920 800Z", "#E9D5A6") +
  g("translate(230 370)", rect(-10, -130, 16, 130, C.grey) + line("M0 -130 L120 0", C.coral, 16) + rect(110, -6, 60, 12, C.coral, 6) + line("M-40 0 L-10 -130 M-10 -90 L-40 -90 M-10 -50 L-30 -50", C.grey, 7)) +
  g("translate(980 360)", rect(-90, -80, 180, 90, C.cream, 6) + path("M-104 -80 L-80 -130 H80 L104 -80Z", C.coral) + rect(-24, -40, 48, 50, C.ink, 4) + g("translate(-54 -10) scale(.45)", icecream(0, 0))) +
  kid(600, 720, { s: 1.3, shirt: C.yellow, long: true, armL: "M-34 -118 L-18 -170", mood: "worry" }) + text(690, 410, "?", 90, C.coral) ;

const bodyOutline = "M0 -300 a46 46 0 1 1 -.1 0 M-54 -210 Q-110 -190 -128 -60 H-96 L-70 -130 V60 L-74 240 H-16 L0 80 L16 240 H74 L70 60 V-130 L96 -60 H128 Q110 -190 54 -210Z";
out["dein-herz-die-pumpe"] = rect(0, 0, 1200, 800, "#F9E5E0") + 
  g("translate(460 460)", path(bodyOutline, "#F5D2B6") + line("M0 -120 C-40 -240 -10 -270 0 -280", C.red, 8) + line("M-16 -110 Q-90 -110 -112 -70 M16 -110 Q90 -110 112 -70", C.red, 8) + line("M-12 -70 Q-46 40 -46 220 M12 -70 Q46 40 46 220", C.red, 8) + line("M-30 -60 Q-70 60 -28 220 M30 -60 Q70 60 28 220", C.blue, 6) + line("M-30 -120 Q-70 -160 -90 -90 M30 -120 Q70 -160 90 -90", C.blue, 6) + heart(4, -105, 1.05)) +
  arrow(600, 170, 590, 210, C.red, 0) + g("translate(880 360)", heart(0, -50, 1.5) + text(0, 70, "≈", 80, C.ink) + path("M-70 200 V130 Q-70 106 -52 110 L-50 90 Q-34 80 -24 100 Q-14 76 8 96 Q24 78 38 104 Q64 96 68 124 L72 200Z", "#E2B287") + line("M-34 112 V146 M-4 104 V146 M28 108 V146", "#BC8859", 5));

const swan = (x, y, f, bill) => g(`translate(${x} ${y})`, path("M-70 0 Q-80 -50 -24 -44 Q40 -40 56 -10 Q34 32 -30 30 Q-66 30 -70 0Z", f) + line("M44 -14 Q70 -60 44 -90 Q32 -106 60 -112", f, 16) + path("M60 -120 L94 -108 L60 -100Z", bill) + circ(58, -112, 3, f === C.white ? C.ink : C.white));
out["ein-gegenbeispiel-reicht"] = rect(0, 0, 1200, 380, "#DCEEF0") + path("M0 380 Q300 330 620 370 T1200 350 V800 H0Z", C.water) + tree(90, 370, .6) + tree(1110, 360, .55) +
  [[140, 500], [360, 470], [570, 500], [770, 470], [240, 640], [470, 640], [690, 650]].map(([x, y]) => swan(x, y, C.white, C.orange)).join("") + swan(990, 600, "#20262B", C.red) + circ(990, 570, 150, "none", `stroke="${C.coral}" stroke-width="6" stroke-dasharray="4 16" stroke-linecap="round"`);

const pendant = (x, y, b, c) => line(`M${x} ${y - 96} V${y - 56}`, C.ink, 4) + circ(x, y, 58, c) + b;
const P = [
  [120, 240, circ(120, 240, 26, C.sun) + line("M120 196 V206 M120 274 V284 M76 240 H86 M154 240 H164 M90 210 l7 7 M143 263 l7 7 M150 210 l-7 7 M97 263 l-7 7", C.sun, 6), "#FDF0CC"],
  [280, 270, path("M292 234 A38 38 0 1 0 292 306 A30 30 0 1 1 292 234Z", "#E6DFA6"), "#2F4266"],
  [440, 290, line("M440 258 V312 M422 298 H458 M440 312 V324", C.grey, 9), "#E3ECE9"],
  [600, 300, rect(570, 296, 60, 10, C.ink, 5) + rect(595, 270, 10, 60, C.coral, 5), "#FBE8DC"],
  [760, 290, path("M770 248 L740 296 H762 L746 334 L786 280 H762Z", C.yellow), "#30455A"],
  [920, 270, [0, 72, 144, 216, 288].map((a) => ell(920, 248, 11, 18, C.pink, `transform="rotate(${a} 920 270)"`)).join("") + circ(920, 270, 9, C.yellow), "#E7F0DC"],
  [1080, 240, path("M1052 262 Q1080 200 1108 262Z", C.coral) + rect(1048, 262, 64, 8, C.ink, 4), "#F9E3E6"],
];
out["woher-die-wochentage-ihre-namen-haben"] = rect(0, 0, 1200, 800, "#F6EDCF") + line("M0 110 Q120 150 280 176 Q600 216 920 176 Q1080 150 1200 110", C.wood2, 7) +
  P.map(([x, y, b, c]) => pendant(x, y, b, c)).join("") + path("M0 800 V640 Q600 540 1200 640 V800Z", C.grass) + kid(600, 740, { s: .95, long: true, armR: "M34 -118 L80 -190", mood: "wow" });

const bunny = (x, y, s, t = "") => g(`translate(${x} ${y}) scale(${s})`, ell(-16, -92, 11, 38, C.cream) + ell(16, -92, 11, 38, C.cream) + circ(0, -46, 30, C.cream) + ell(0, 0, 32, 36, C.cream) + circ(-10, -50, 3.5, C.ink) + circ(10, -50, 3.5, C.ink) + t);
out["anfang-mitte-ende"] = rect(0, 0, 1200, 800, C.sky) + cloud(980, 110, .9) + path("M0 800 V640 Q280 610 600 200 Q900 590 1200 640 V800Z", C.grass) + path("M60 660 Q330 610 600 240 Q880 600 1150 660", "none", `stroke="#E9D5A6" stroke-width="24" stroke-linecap="round"`) +
  bunny(150, 650, 1.1) + bunny(590, 225, 1.25) + g("translate(690 330) rotate(30)", circ(0, 0, 18, "none", `stroke="${C.yellow}" stroke-width="9"`) + line("M18 0 H62 M46 0 V14 M58 0 V12", C.yellow, 8)) + text(590, 80, "?", 100, C.coral) +
  g("translate(1060 650)", rect(-70, -96, 140, 100, C.cream, 6) + path("M-84 -96 L0 -160 L84 -96Z", C.red) + rect(-22, -60, 44, 64, C.coral, 4) + circ(14, -28, 4, C.yellow)) + bunny(960, 652, 1.1);

const blossom = (x, y, s = 1) => g(`translate(${x} ${y}) scale(${s})`, [0, 72, 144, 216, 288].map((a) => ell(0, -58, 34, 52, "#F9DCE0", `transform="rotate(${a})"`)).join("") + circ(0, 0, 26, C.yellow) + [0, 60, 120, 180, 240, 300].map((a) => line("M0 0 L0 -38", "#C9962B", 3, `transform="rotate(${a})"`)).join(""));
const bee = g("translate(600 180)", ell(-16, -40, 28, 42, C.white, 'opacity=".85" transform="rotate(-20 -16 -40)"') + ell(30, -42, 26, 40, C.white, 'opacity=".85" transform="rotate(20 30 -42)"') + ell(0, 0, 66, 42, C.yellow) + rect(-26, -40, 18, 80, C.ink) + rect(14, -40, 18, 80, C.ink) + circ(62, -2, 25, C.ink) + circ(70, -8, 5, C.white) + [[-38, 44], [-14, 50], [12, 50], [36, 44], [-50, 26]].map(([x, y]) => circ(x, y, 7, C.orange)).join(""));
const stage = (x, b) => g(`translate(${x} 680)`, b);
out["bienen-als-pollen-boten"] = rect(0, 0, 1200, 800, "#E9F2DC") + blossom(190, 250, 1.3) + blossom(1010, 250, 1.3) + dashed("M290 220 Q420 110 520 170") + dashed("M690 180 Q800 120 910 220") + bee +
  line("M40 520 H1160", C.grass2, 4, 'stroke-dasharray="6 14"') + stage(180, blossom(0, 0, .8)) + stage(500, circ(0, 0, 26, "#BFD27A") + line("M0 -26 Q6 -50 22 -50", C.wood2, 6)) + stage(820, circ(0, 0, 58, C.red) + line("M0 -58 Q6 -86 22 -88", C.wood2, 6) + ell(30, -80, 22, 11, C.leaf) ) + arrow(300, 680, 410, 680, C.ink, 7) + arrow(590, 680, 700, 680, C.ink, 7);

out["zwei-seiten-einer-sechs"] = rect(0, 0, 1200, 800, "#F9E3E6") + path("M0 800 V520 Q600 460 1200 520 V800Z", "#E6D2A8") +
  ell(600, 640, 300, 96, "#CBB382") + g("translate(600 640) rotate(90)", text(0, 96, "6", 270, C.green)) +
  kid(160, 730, { s: 1.2, armR: "M34 -118 L100 -100" }) + kid(1040, 730, { s: 1.2, skin: 2, shirt: C.blue, hair: C.ink, long: true, armL: "M-34 -118 L-100 -100" }) +
  ell(250, 180, 120, 88, C.cream) + text(250, 232, "6", 130, C.green) + ell(950, 180, 120, 88, C.cream) + text(950, 232, "9", 130, C.green) + circ(200, 300, 14, C.cream) + circ(1000, 300, 14, C.cream);

out["die-wippe-und-der-hebel"] = scene("#E2ECF2", C.grass, 590) + cloud(200, 120, .8) + cloud(1000, 150, .7) +
  rect(120, 500, 960, 30, C.wood, 12) + path("M600 530 L530 690 H670Z", C.coral) +
  g("translate(190 500)", kid(0, 0, { s: .95, long: true, armL: "M-34 -118 L-60 -160" })) +
  adult(760, 500, {}) +
  line("M190 570 H600", C.ink, 5) + line("M190 556 V584 M600 556 V584", C.ink, 5) + line("M600 570 H760", C.ink, 5) + line("M760 556 V584", C.ink, 5);

out["mut-und-angst"] = rect(0, 0, 1200, 800, "#DFF0F1") + rect(0, 0, 620, 800, "#EADFC9") + path("M0 800 V440 H620 L650 800Z", "#CBB382") + rect(620, 500, 580, 300, C.water) + path("M620 500 H1200 V540 Q910 520 620 540Z", C.water2) +
  kid(470, 440, { s: 1.15, mood: "worry", armL: "M-34 -118 L-6 -96", armR: "M34 -118 L6 -96", long: true }) +
  g("translate(200 340)", heart(0, 0, 1.3, C.coral) + line("M0 -44 V-120 M-60 -96 Q0 -160 60 -96 Z", C.blue, 7) + path("M-60 -96 Q0 -170 60 -96Z", C.blue)) +
  adult(910, 780, { armL: "M-34 -118 L-92 -150", armR: "M34 -118 L92 -150", skin: 1, hair: C.ink }) + rect(620, 660, 580, 140, C.water, 0, 'opacity=".65"') +
  dashed("M520 420 Q640 360 760 470", C.coral);

const figure = (x, y, o) => kid(x, y, { s: .95, ...o });
const shoeSmall = g("scale(.6)", shoe);
const coin = (x, y) => circ(x, y, 26, C.yellow) + circ(x, y, 17, "none", `stroke="#A9872A" stroke-width="4"`);
out["warum-es-geld-gibt"] = rect(0, 0, 1200, 800, "#F6EDCF") + circ(600, 430, 230, "none", `stroke="${C.wood}" stroke-width="10" stroke-dasharray="4 26" stroke-linecap="round"`) +
  figure(600, 300, { shirt: C.cream, long: true, hair: C.ink, skin: 1, armR: "M34 -118 L74 -96" }) + g("translate(690 200)", bread(0, 0)) +
  figure(240, 690, { shirt: C.leaf, armR: "M34 -118 L74 -96" }) + g("translate(330 620)", circ(0, 0, 32, C.red) + circ(46, 10, 28, C.red) + line("M0 -30 V-44", C.wood2, 5)) +
  figure(960, 690, { shirt: C.blue, skin: 2, hair: C.ink, armL: "M-34 -118 L-74 -96" }) + g("translate(830 640)", path("M-60 18 Q-62 -22 -44 -26 Q-26 -28 -24 -14 Q-4 -4 28 0 Q56 4 56 20Z", C.coral)) +
  coin(394, 300) + coin(806, 300) + coin(600, 650) + arrow(330, 390, 370, 340, C.ink, 6) + arrow(780, 320, 830, 400, C.ink, 6) + arrow(690, 640, 640, 648, C.ink, 6);

const crate = (x, y, w, h) => rect(x, y, w, h, C.wood, 8) + line(`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`, C.wood2, 7) + rect(x, y, w, h, "none", 8, `stroke="${C.wood2}" stroke-width="7"`);
const wheel = (x, y) => circ(x, y, 42, C.ink) + circ(x, y, 18, C.cream);
out["warum-raeder-rollen"] = scene("#E2ECF2", C.earth, 590) + cloud(220, 120, .8) + cloud(960, 140, .8) + rect(597, 180, 6, 500, C.ink, 3, 'opacity=".25"') +
  crate(250, 480, 190, 150) + kid(150, 640, { mood: "worry", armR: "M34 -118 L100 -112", s: .95 }) +
  line("M240 650 h-30 M300 650 h-40 M380 650 h-40", C.red, 7) +
  rect(780, 560, 290, 28, C.coral, 10) + crate(830, 410, 190, 150) + wheel(840, 610) + wheel(1010, 610) +
  line("M780 575 L705 520", C.ink, 7) + kid(690, 640, { long: true, skin: 2, hair: C.ink, shirt: C.yellow, armR: "M34 -118 L18 -116", s: .95 }) + arrow(600 + 30, 720, 780, 720, C.green, 8);

const cup = (x, y) => path(`M${x} ${y} H${x + 170} L${x + 148} ${y + 190} H${x + 22}Z`, C.cream, `stroke="${C.wood2}" stroke-width="6"`) + text(x + 85, y + 120, "10", 86, C.green);
const button = (x, y) => circ(x, y, 26, C.coral) + circ(x - 7, y, 4, C.cream) + circ(x + 7, y, 4, C.cream);
const palm = (x, flip) => g(`translate(${x} 170) scale(${flip} 1)`, rect(-60, -10, 120, 110, SKINS[0], 34) + [-52, -26, 0, 26].map((d) => rect(d - 10, -86, 21, 96, SKINS[0], 10)).join("") + line("M50 60 L100 8", SKINS[0], 24));
out["warum-wir-in-zehnern-zaehlen"] = rect(0, 0, 1200, 800, "#E1EBF6") + rect(0, 560, 1200, 240, C.wood) + rect(0, 560, 1200, 16, C.wood2) +
  palm(470, 1) + palm(730, -1) + cup(70, 400) + cup(280, 400) + cup(490, 400) +
  [[760, 500], [840, 500], [920, 500], [1000, 500], [800, 570], [880, 570], [960, 570]].map(([x, y]) => button(x, y)).join("");

const speck = (x, y) => circ(x, y, 7, C.earth3);
const drop = (x, y) => path(`M${x} ${y - 20} Q${x + 16} ${y + 2} ${x} ${y + 14} Q${x - 16} ${y + 2} ${x} ${y - 20}Z`, C.water);
out["warum-du-blinzelst"] = rect(0, 0, 1200, 800, "#F9E5E0") + ell(600, 420, 390, 220, C.white) +
  circ(600, 430, 150, C.blue) + circ(600, 430, 76, C.ink) + circ(640, 390, 26, C.white) +
  path("M210 420 Q600 90 990 420 Q600 250 210 420Z", SKINS[0]) + line("M210 420 Q600 250 990 420", C.earth3, 10) +
  [[300, 300], [430, 250], [560, 232], [700, 236], [830, 262], [930, 320]].map(([x, y], i) => line(`M${x} ${y} l${(i - 2.5) * 12} -46`, C.earth3, 8)).join("") +
  arrow(1050, 240, 1050, 470, C.coral, 9) + drop(330, 480) + drop(460, 590) + drop(770, 590) + drop(880, 480) +
  speck(260, 640) + speck(310, 690) + speck(220, 700) + arrow(380, 680, 300, 700, C.ink, 5);

for (const [slug, body] of Object.entries(out)) writeFileSync(new URL(`../public/illustrations/${slug}.svg`, import.meta.url), svg(slug, body));
console.log(Object.keys(out).length, "Illustrationen");
