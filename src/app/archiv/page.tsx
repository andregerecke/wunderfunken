import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveView } from "@/components/ArchiveView";
import { searchableText, toCard } from "@/domain/post";
import { WORLD_KEYS } from "@/domain/worlds";
import { allPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Archiv" };

export default function Archive() {
  const posts = allPosts();
  const cards = posts.map((p) => ({ ...toCard(p, p.issueDate), search: searchableText(p) }));
  const worlds = WORLD_KEYS.filter((w) => posts.some((p) => p.world === w))
    .sort((a, b) => posts.filter((p) => p.world === b).length - posts.filter((p) => p.world === a).length);
  return (
    <div className="wrap page full">
      <h1>Archiv</h1>
      <Suspense fallback={<p>Einen Moment …</p>}><ArchiveView cards={cards} worlds={worlds} /></Suspense>
    </div>
  );
}
