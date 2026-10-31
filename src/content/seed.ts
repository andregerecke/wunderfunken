import type { Post } from "../domain/post";
import checks from "./source-checks.json";
import { seedA } from "./seed-a";
import { seedB } from "./seed-b";
import type { SeedInput } from "./seed-types";

const ORIGIN = "Eigens für Wunderfunken gezeichnete SVG-Illustration (keine KI, keine Fremdbilder)";

function toPost(s: SeedInput): Post {
  return {
    id: `seed-${s.slug}`, slug: s.slug, title: s.title, teaser: s.teaser, concept: s.concept,
    world: s.world, topics: s.topics, stem: s.stem, format: s.format, minutes: s.minutes,
    question: s.question, explanation: s.explanation,
    image: {
      status: "ready", kind: "svg", src: `/illustrations/${s.slug}.svg`, width: 1200, height: 800,
      alt: s.imageAlt, origin: ORIGIN, title: s.imageTitle, description: s.imageDescription,
      lookCloser: s.lookCloser,
    },
    wow: s.wow,
    activity: { title: s.activityTitle, materials: s.materials, steps: s.steps },
    check: { question: s.checkQuestion, answer: s.checkAnswer, parentPrompt: s.parentPrompt },
    takeaway: s.takeaway, followUp: s.followUp,
    sources: (checks as Record<string, Post["sources"]>)[s.slug] ?? [],
    version: 1, isSeed: true,
  };
}

/** Reihenfolge ist redaktionell: Format und Wissenswelt wechseln, STEM ist über das Fenster verteilt. */
export const SEED_POSTS: Post[] = [...seedA, ...seedB].map(toPost);
