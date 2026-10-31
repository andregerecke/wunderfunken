import { createHash } from "node:crypto";
import { spokenParts, type Post } from "../domain/post";

/** Satzzeichen am Ende sorgen für eine Sprechpause, auch nach Überschriften. */
export function spokenText(post: Post): string {
  return spokenParts(post).map((p) => (/[.!?:]$/.test(p) ? p : `${p}.`)).join("\n\n");
}

/** Der Dateiname enthält den Inhalt: Ändert sich der Text, entsteht eine neue Aufnahme. */
export function audioFile(post: Post): string {
  const hash = createHash("sha256").update(spokenText(post)).digest("hex").slice(0, 10);
  return `${post.slug}-${hash}.mp3`;
}
