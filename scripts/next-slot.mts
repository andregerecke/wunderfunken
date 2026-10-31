// Zeigt dem täglichen Lauf, was die nächste Ausgabe sein darf.
import { SEED_POSTS } from "../src/content/seed";
import { toFacts } from "../src/domain/issue";
import { planNextSlot } from "../src/domain/mix";
import { currentIssueDate, TIME_ZONE } from "../src/domain/time";
import { loadIssues } from "../src/lib/content";

const issues = loadIssues();
const plan = planNextSlot(issues.map(toFacts));
const now = new Date();
const issueDate = currentIssueDate(now);
const berlinToday = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
const alreadyDone = issues.some((i) => i.issueDate === issueDate);
console.log(JSON.stringify({
  run: issueDate === berlinToday && !alreadyDone,
  issueDate,
  stemAllowed: plan.allowStem,
  worlds: plan.worlds,
  formats: plan.formats,
  avoidConcepts: [...plan.avoidConcepts, ...SEED_POSTS.map((p) => p.concept)],
  usedSlugs: [...issues.map((i) => i.post.slug), ...SEED_POSTS.map((p) => p.slug)],
  reviewCandidates: issues.slice(4).map((i) => ({ postId: i.post.id, slug: i.post.slug, title: i.post.title, question: i.post.question })),
}, null, 2));
