import type { Post, PostCard } from "@/domain/post";
import { asset } from "@/lib/site";

type Pic = PostCard["image"] | Post["image"];

/** Fehlt ein Bild, steht das offen da. Es gibt keinen stillen Ersatz durch ein altes Motiv. */
export function Illustration({ image, priority }: { image: Pic; priority?: boolean }) {
  if (image.status !== "ready") {
    return (
      <div className="missing-pic">
        <strong>Das Bild ist noch nicht fertig.</strong>
        <span>Bildbeschreibung: {image.description}</span>
      </div>
    );
  }
  return (
    <img
      src={asset(image.src)}
      alt={image.alt} width={image.width} height={image.height}
      loading={priority ? "eager" : "lazy"} decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
