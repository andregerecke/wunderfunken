"use client";

import Link from "next/link";
import type { Post } from "@/domain/post";
import { usePersonal } from "./Personal";

/** Nur sichtbar, solange die Bestätigung besteht. Wird sie zurückgenommen, verschwindet die Frage. */
export function ReviewBlock({ review }: { review: NonNullable<Post["review"]> }) {
  const { discovered } = usePersonal();
  if (!discovered.has(review.slug)) return null;
  return (
    <section className="block review" aria-label="Wiederholung">
      <h2>Erinnert ihr euch?</h2>
      <p>{review.question}</p>
      <p>Das hatten wir bei <Link href={`/wissen/${review.slug}`}>{review.title}</Link> entdeckt.</p>
    </section>
  );
}
