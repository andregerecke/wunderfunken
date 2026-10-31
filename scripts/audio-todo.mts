// Schreibt auf, welche Aufnahmen fehlen, und räumt verwaiste auf.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { audioFile, spokenText } from "../src/lib/audio";
import { allPosts } from "../src/lib/content";

const dir = "public/audio";
mkdirSync(dir, { recursive: true });
const posts = allPosts();
const wanted = new Set(posts.map(audioFile));
for (const f of readdirSync(dir)) if (!wanted.has(f)) rmSync(`${dir}/${f}`);
const todo = posts.filter((p) => !existsSync(`${dir}/${audioFile(p)}`)).map((p) => ({ file: audioFile(p), text: spokenText(p) }));
writeFileSync(process.argv[2] ?? "audio-todo.json", JSON.stringify(todo));
console.log(`${posts.length} Häppchen, ${todo.length} Aufnahmen fehlen.`);
