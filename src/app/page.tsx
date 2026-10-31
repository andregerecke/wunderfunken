import Link from "next/link";
import { SaveButton } from "@/components/Actions";
import { Illustration } from "@/components/Illustration";
import { IssueStamp } from "@/components/IssueStamp";
import { CardGrid } from "@/components/PostCardView";
import { ReadAloud } from "@/components/ReadAloud";
import { Surprise } from "@/components/Surprise";
import { WorldChip } from "@/components/WorldChip";
import { spokenParts } from "@/domain/post";
import { FORMATS, WORLDS, WORLD_KEYS } from "@/domain/worlds";
import { allCards, allPosts, loadIssues } from "@/lib/content";
import { asset } from "@/lib/site";

const VISIBLE_WORLDS = 6;

export default function Home() {
  const latest = loadIssues()[0];
  const posts = allPosts();
  const post = latest?.post ?? posts[0]!;
  const cards = allCards().filter((c) => c.slug !== post.slug).slice(0, 9);
  const worlds = WORLD_KEYS.filter((w) => posts.some((p) => p.world === w))
    .sort((a, b) => posts.filter((p) => p.world === b).length - posts.filter((p) => p.world === a).length);

  return (
    <div className="wrap">
      <section className="hero" aria-labelledby="heute">
          <div className="hero-text">
            {latest ? <IssueStamp issueDate={latest.issueDate} /> : <p className="eyebrow">Aus unserem Startbestand</p>}
            <div className="meta"><WorldChip world={post.world} /><span>{post.minutes} Min.</span><span aria-hidden="true">·</span><span>{FORMATS[post.format]}</span></div>
            <h1 id="heute"><Link href={`/wissen/${post.slug}`} className="hero-link">{post.title}</Link></h1>
            <p className="lead">{post.teaser}</p>
            <div className="actions">
              <Link href={`/wissen/${post.slug}`} className="btn">Jetzt entdecken</Link>
              <ReadAloud parts={spokenParts(post)} />
              <SaveButton slug={post.slug} title={post.title} />
            </div>
          </div>
          <div className="hero-pic"><Illustration image={post.image} priority /></div>
      </section>

      <section className="section" aria-labelledby="sammlung">
        <div className="section-head">
          <h2 id="sammlung">Mehr entdecken</h2>
          <Surprise slugs={posts.map((p) => p.slug)} />
        </div>
        <div className="tools">
          <form className="search" action={asset("/archiv")} role="search">
            <label className="sr" htmlFor="suche">Themen suchen</label>
            <input id="suche" name="q" type="search" placeholder="Wonach suchst du?" />
            <button className="btn small" type="submit">Suchen</button>
          </form>
          <div>
            <div className="chips">
              {worlds.slice(0, VISIBLE_WORLDS).map((world) => <Link key={world} className="chip" href={`/archiv?welt=${world}`}>{WORLDS[world].label}</Link>)}
            </div>
            {worlds.length > VISIBLE_WORLDS && (
              <details className="more">
                <summary>Weitere Wissenswelten</summary>
                <div className="chips">
                  {worlds.slice(VISIBLE_WORLDS).map((world) => <Link key={world} className="chip" href={`/archiv?welt=${world}`}>{WORLDS[world].label}</Link>)}
                </div>
              </details>
            )}
          </div>
        </div>
        <CardGrid cards={cards} />
        <div className="pager"><Link className="btn ghost" href="/archiv">Alle {posts.length} Häppchen ansehen</Link></div>
      </section>
    </div>
  );
}
