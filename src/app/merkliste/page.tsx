import type { Metadata } from "next";
import { MyList } from "@/components/MyList";
import { allCards } from "@/lib/content";

export const metadata: Metadata = { title: "Merkliste" };

export default function Page() {
  return <div className="wrap page full"><MyList cards={allCards()} /></div>;
}
