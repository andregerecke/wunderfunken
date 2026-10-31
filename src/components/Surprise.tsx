"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DiceIcon } from "./Icons";

export function Surprise({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  return (
    <Link href={`/wissen/${slugs[0]}`} prefetch={false} className="btn ghost small"
      onClick={(e) => { e.preventDefault(); router.push(`/wissen/${slugs[Math.floor(Math.random() * slugs.length)]}`); }}>
      <DiceIcon /> Überrasch mich
    </Link>
  );
}
