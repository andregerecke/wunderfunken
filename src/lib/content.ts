import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { SEED_POSTS } from "../content/seed";
import { issueSchema, type Issue } from "../domain/issue";
import { toCard, type Post, type PostCard } from "../domain/post";

/** Liest beim Bauen. Die Seite selbst hat keinen Server. */
export function loadIssues(dir = process.env.CONTENT_DIR ?? "content/issues"): Issue[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => issueSchema.parse(JSON.parse(readFileSync(path.join(dir, f), "utf8"))) as Issue)
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
}

export function allPosts(): (Post & { issueDate?: string })[] {
  return [...loadIssues().map((i) => ({ ...i.post, issueDate: i.issueDate })), ...SEED_POSTS];
}

export function allCards(): PostCard[] {
  return allPosts().map((p) => toCard(p, p.issueDate));
}
