export const WORLDS = {
  sprache: { label: "Sprache & Wörter", color: "#9A4A1F", tint: "#FBE8DC" },
  denken: { label: "Logik & Denken", color: "#5A4A8A", tint: "#ECE8F5" },
  erde: { label: "Geographie & Erde", color: "#1F6470", tint: "#DFF0F1" },
  zeit: { label: "Geschichte & Zeit", color: "#7A5B14", tint: "#F6EDCF" },
  miteinander: { label: "Menschen & Zusammenleben", color: "#A03A4E", tint: "#F9E3E6" },
  kulturen: { label: "Religionen & Kulturen", color: "#7B3F86", tint: "#F3E5F4" },
  alltag: { label: "Alltag & Leben", color: "#3E6324", tint: "#E7F0DC" },
  gefuehle: { label: "Gefühle", color: "#B03A2A", tint: "#FBE4DF" },
  natur: { label: "Natur & Tiere", color: "#2B6B3F", tint: "#DDF0E1" },
  koerper: { label: "Mein Körper", color: "#A0443A", tint: "#F9E5E0" },
  technik: { label: "Technik", color: "#35586F", tint: "#E2ECF2" },
  zahlen: { label: "Zahlen & Muster", color: "#2F5C8A", tint: "#E1EBF6" },
} as const;

export type World = keyof typeof WORLDS;
export const WORLD_KEYS = Object.keys(WORLDS) as World[];

export const FORMATS = {
  warum: "Warum ist das so?",
  loesung: "Findest du die Lösung?",
  probieren: "Probier es aus!",
} as const;

export type Format = keyof typeof FORMATS;
export const FORMAT_KEYS = Object.keys(FORMATS) as Format[];
