import type { PostCard } from "./post";
import type { Format, World } from "./worlds";

export type ArchiveCard = PostCard & { search: string };
export type ArchiveFilter = { q?: string; world?: World; format?: Format };

export function filterCards(cards: ArchiveCard[], { q, world, format }: ArchiveFilter): ArchiveCard[] {
  const terms = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return cards.filter(
    (c) => (!world || c.world === world) && (!format || c.format === format) && terms.every((t) => c.search.includes(t)),
  );
}
