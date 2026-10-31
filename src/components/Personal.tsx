"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export type Discovered = { slug: string; title: string; at: string };
type Ctx = {
  ready: boolean;
  saved: Set<string>; discovered: Map<string, Discovered>;
  toggleSave(slug: string): void;
  confirm(slug: string, title: string): void;
  withdraw(slug: string): void;
};

const PersonalContext = createContext<Ctx | null>(null);
const KEY_SAVED = "wf:saved";
const KEY_DONE = "wf:discovered";

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Privater Modus: bleibt bis zum Neuladen im Speicher. */
  }
}

export function PersonalProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [discovered, setDiscovered] = useState<Map<string, Discovered>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(new Set(readLocal<string[]>(KEY_SAVED, [])));
    setDiscovered(new Map(readLocal<Discovered[]>(KEY_DONE, []).map((d) => [d.slug, d])));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeLocal(KEY_SAVED, [...saved]);
    writeLocal(KEY_DONE, [...discovered.values()]);
  }, [ready, saved, discovered]);

  const toggleSave = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (!next.delete(slug)) next.add(slug);
      return next;
    });
  }, []);

  const confirm = useCallback((slug: string, title: string) => {
    setDiscovered((prev) => new Map(prev).set(slug, { slug, title, at: new Date().toISOString() }));
  }, []);

  const withdraw = useCallback((slug: string) => {
    setDiscovered((prev) => {
      const next = new Map(prev);
      next.delete(slug);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ready, saved, discovered, toggleSave, confirm, withdraw }),
    [ready, saved, discovered, toggleSave, confirm, withdraw],
  );
  return <PersonalContext value={value}>{children}</PersonalContext>;
}

export function usePersonal(): Ctx {
  const ctx = use(PersonalContext);
  if (!ctx) throw new Error("PersonalProvider fehlt");
  return ctx;
}
