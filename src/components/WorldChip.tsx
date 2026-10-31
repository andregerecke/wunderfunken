import { WORLDS, type World } from "@/domain/worlds";

export function WorldChip({ world }: { world: World }) {
  const w = WORLDS[world];
  return <span className="chip-world" style={{ background: w.tint, color: w.color }}>{w.label}</span>;
}
