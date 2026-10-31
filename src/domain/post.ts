import { z } from "zod";
import { FORMAT_KEYS, WORLD_KEYS } from "./worlds";

export const sourceSchema = z.object({
  title: z.string().min(3),
  url: z.url().startsWith("https://"),
  publisher: z.string().min(2),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
});

export const imageSchema = z.object({
  status: z.enum(["ready", "missing"]),
  kind: z.enum(["svg", "ai", "none"]),
  src: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(10),
  origin: z.string().min(5),
  title: z.string().min(3),
  description: z.string().min(20),
  lookCloser: z.string().startsWith("Schau mal genau hin:"),
});

/** Inhalt ohne Datum und ohne persönliche Daten: Tageszuordnung liegt separat. */
export const postSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5).max(70),
  teaser: z.string().min(15).max(130),
  concept: z.string().min(5),
  world: z.enum(WORLD_KEYS as [string, ...string[]]),
  topics: z.array(z.string()).min(1),
  stem: z.object({ isStem: z.boolean(), reason: z.string().min(10) }),
  format: z.enum(FORMAT_KEYS as [string, ...string[]]),
  minutes: z.number().int().min(5).max(15),
  question: z.string().endsWith("?"),
  explanation: z.array(z.string().min(20)).min(2).max(5),
  image: imageSchema,
  wow: z.string().min(20),
  activity: z.object({
    title: z.string().min(3),
    materials: z.array(z.string()),
    steps: z.array(z.string().min(5)).min(2).max(6),
  }),
  check: z.object({
    question: z.string().endsWith("?"),
    answer: z.string().min(10),
    parentPrompt: z.string().min(10),
  }),
  takeaway: z.string().min(10).max(120),
  followUp: z.string().endsWith("?"),
  sources: z.array(sourceSchema).min(1),
  review: z.object({ postId: z.string(), slug: z.string(), title: z.string(), question: z.string() }).nullish(),
  version: z.number().int().min(1),
  isSeed: z.boolean(),
});

export type Post = Omit<z.infer<typeof postSchema>, "world" | "format"> & {
  world: import("./worlds").World;
  format: import("./worlds").Format;
};
export type PostSource = z.infer<typeof sourceSchema>;
export type PostCard = Pick<Post, "id" | "slug" | "title" | "teaser" | "world" | "format" | "minutes"> & {
  image: Pick<Post["image"], "status" | "src" | "alt" | "width" | "height" | "kind" | "description">;
  issueDate?: string;
};

export function toCard(post: Post, issueDate?: string): PostCard {
  const { id, slug, title, teaser, world, format, minutes } = post;
  const { status, src, alt, width, height, kind, description } = post.image;
  return {
    id, slug, title, teaser, world, format, minutes,
    image: { status, src, alt, width, height, kind, description },
    ...(issueDate ? { issueDate } : {}),
  };
}

/** Nur diese Teile werden vorgelesen. Elternlösung und Quellen bleiben bewusst draußen. */
export function spokenParts(post: Post): string[] {
  return [
    post.title,
    post.question,
    ...post.explanation,
    post.image.title,
    post.image.description,
    post.image.lookCloser,
    post.wow,
    post.activity.title,
    ...post.activity.steps,
    post.check.question,
    `Das merken wir uns: ${post.takeaway}`,
  ];
}

export function searchableText(post: Post): string {
  return [post.title, post.teaser, post.concept, ...post.topics].join(" ").toLowerCase();
}
