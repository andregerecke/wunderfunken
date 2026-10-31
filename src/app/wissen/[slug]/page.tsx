import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscoverPanel, SaveButton } from "@/components/Actions";
import { Illustration } from "@/components/Illustration";
import { ReadAloud } from "@/components/ReadAloud";
import { ReviewBlock } from "@/components/ReviewBlock";
import { WorldChip } from "@/components/WorldChip";
import { spokenParts } from "@/domain/post";
import { formatGermanDate } from "@/domain/time";
import { FORMATS } from "@/domain/worlds";
import { allPosts } from "@/lib/content";
import { asset } from "@/lib/site";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts().find((p) => p.slug === slug);
  return { title: post?.title ?? "Nicht gefunden" };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = allPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="wrap article">
        <header style={{ display: "grid", gap: 10 }}>
          <Link href="/" className="back">← Zur Startseite</Link>
          <div className="meta">
            <WorldChip world={post.world} /><span>{post.minutes} Min.</span><span aria-hidden="true">·</span><span>{FORMATS[post.format]}</span>
            {post.issueDate && <><span aria-hidden="true">·</span><span>{formatGermanDate(post.issueDate)}</span></>}
          </div>
          <h1>{post.title}</h1>
          <p className="question">{post.question}</p>
        </header>

        {post.review && <ReviewBlock review={post.review} />}

        <div className="prose">{post.explanation.map((p) => <p key={p}>{p}</p>)}</div>

        <figure className="figure">
          {post.image.status === "ready"
            ? <a href={asset(post.image.src)} aria-label={`${post.image.title}: Bild vollständig ansehen`}><Illustration image={post.image} /></a>
            : <Illustration image={post.image} />}
          <figcaption>
            <h2>{post.image.title}</h2>
            <p>{post.image.description}</p>
            <p className="look">{post.image.lookCloser}</p>
            <p className="origin">Bild: {post.image.origin}</p>
          </figcaption>
        </figure>

        <section className="block wow"><h2>Wow!</h2><p>{post.wow}</p></section>

        <section className="block do">
          <h2>Mach mit: {post.activity.title}</h2>
          {post.activity.materials.length > 0 && <p><strong>Ihr braucht:</strong> {post.activity.materials.join(", ")}</p>}
          <ol>{post.activity.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <p className="origin">Macht nur mit, wenn ihr Lust habt.</p>
        </section>

        <section className="block" style={{ padding: 0 }}>
          <h2>Was meinst du?</h2>
          <p>{post.check.question}</p>
          <details className="fold">
            <summary>Lösung für Große</summary>
            <div><p>{post.check.answer}</p><p><strong>Gesprächsimpuls:</strong> {post.check.parentPrompt}</p></div>
          </details>
        </section>

        <section className="block keep"><h2>Das merken wir uns</h2><p>{post.takeaway}</p><p>{post.followUp}</p></section>

        <DiscoverPanel slug={post.slug} title={post.title} />

        <details className="fold">
          <summary>Quellen</summary>
          <div>
            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
              {post.sources.map((s) => (
                <li key={s.url}><a href={s.url} rel="noreferrer noopener" target="_blank">{s.title}</a>, {s.publisher}, geprüft am {formatGermanDate(s.checkedAt.slice(0, 10))}</li>
              ))}
            </ul>
          </div>
        </details>
      </article>
      <div className="actionbar"><div className="actionbar-in">
        <ReadAloud key={post.slug} parts={spokenParts(post)} />
        <SaveButton slug={post.slug} title={post.title} />
      </div></div>
    </>
  );
}
