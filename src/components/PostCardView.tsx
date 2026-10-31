import Link from "next/link";
import type { PostCard } from "@/domain/post";
import { formatGermanDate } from "@/domain/time";
import { FORMATS } from "@/domain/worlds";
import { DoneTag, SaveIconButton } from "./Actions";
import { Illustration } from "./Illustration";
import { WorldChip } from "./WorldChip";

export function PostCardView({ card }: { card: PostCard }) {
  return (
    <article className="card">
      <div className="card-pic"><Illustration image={card.image} /></div>
      <DoneTag slug={card.slug} />
      <SaveIconButton slug={card.slug} title={card.title} className="save" />
      <div className="card-body">
        <div><WorldChip world={card.world} /></div>
        <h3><Link href={`/wissen/${card.slug}`}>{card.title}</Link></h3>
        <p>{card.teaser}</p>
        <div className="card-foot">
          <span>{card.minutes} Min.</span><span aria-hidden="true">·</span><span>{FORMATS[card.format]}</span>
          {card.issueDate && <><span aria-hidden="true">·</span><span>{formatGermanDate(card.issueDate)}</span></>}
        </div>
      </div>
    </article>
  );
}

export function CardGrid({ cards }: { cards: PostCard[] }) {
  return <ul className="grid">{cards.map((c) => <li key={c.id}><PostCardView card={c} /></li>)}</ul>;
}
