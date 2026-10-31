import type { Format, World } from "@/domain/worlds";

export type SeedInput = {
  slug: string; title: string; teaser: string; concept: string;
  world: World; topics: string[];
  stem: { isStem: boolean; reason: string };
  format: Format; minutes: number; question: string; explanation: string[];
  imageTitle: string; imageAlt: string; imageDescription: string; lookCloser: string;
  wow: string; activityTitle: string; materials: string[]; steps: string[];
  checkQuestion: string; checkAnswer: string; parentPrompt: string;
  takeaway: string; followUp: string;
};
