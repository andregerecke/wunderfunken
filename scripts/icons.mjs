import sharp from "sharp";
import { writeFileSync } from "node:fs";

const spark = (s, off) => `<g transform="translate(${off} ${off}) scale(${s})"><path d="M16 2c1.2 8 4.8 11.8 13 14-8.2 2.200-11.800 6-13 14-1.200-8-4.800-11.800-13-14C11.200 13.800 14.800 10 16 2Z" fill="#F8F6EF"/><circle cx="26" cy="6" r="2.400" fill="#F2A07F"/></g>`;
const icon = (size, pad, round) => {
  const s = (size * (1 - 2 * pad)) / 32;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${round ? size * 0.22 : 0}" fill="#2B5141"/>${spark(s, size * pad)}</svg>`);
};
const out = `${process.cwd()}/public/icons/`;
for (const [name, size, pad, round] of [["icon-192", 192, .16, true], ["icon-512", 512, .16, true], ["icon-maskable-512", 512, .26, false], ["apple-touch-icon", 180, .16, false]]) {
  writeFileSync(`${out}${name}.png`, await sharp(icon(size, pad, round)).png().toBuffer());
}
console.log("Icons fertig");
