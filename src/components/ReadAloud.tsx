"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, StopIcon } from "./Icons";

type State = "idle" | "playing" | "paused";

/** Spielt die fertige Aufnahme ab. Es gibt bewusst keinen Rückfall auf die Roboterstimme des Geräts. */
export function ReadAloud({ src, label = "Vorlesen" }: { src: string; label?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<State>("idle");
  const [trouble, setTrouble] = useState(false);

  useEffect(() => {
    const el = audio.current;
    const stop = () => { el?.pause(); setState("idle"); };
    window.addEventListener("pagehide", stop);
    return () => { window.removeEventListener("pagehide", stop); el?.pause(); };
  }, []);

  const play = () => {
    setTrouble(false);
    audio.current?.play().catch(() => { setTrouble(true); setState("idle"); });
  };
  const stop = () => {
    const el = audio.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setState("idle");
  };

  return (
    <div className="read" role="group" aria-label="Vorlesen">
      <audio ref={audio} src={src} preload="none" onPlay={() => setState("playing")} onEnded={stop}
        onError={() => { setTrouble(true); setState("idle"); }} />
      {state === "idle" && (
        <button type="button" className="btn small" onClick={play}><PlayIcon /> {label}</button>
      )}
      {state === "playing" && (
        <button type="button" className="btn small" onClick={() => { audio.current?.pause(); setState("paused"); }}><PauseIcon /> Pause</button>
      )}
      {state === "paused" && (
        <button type="button" className="btn small" onClick={play}><PlayIcon /> Weiter</button>
      )}
      {state !== "idle" && (
        <button type="button" className="btn ghost small" onClick={stop}><StopIcon /> Stopp</button>
      )}
      {trouble && <span className="read-status" role="status">Das Vorlesen klappt gerade nicht. Lest gern selbst weiter.</span>}
    </div>
  );
}
