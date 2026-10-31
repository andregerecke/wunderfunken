"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, StopIcon } from "./Icons";

type State = "idle" | "playing" | "paused";

function germanVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "de-DE" && v.localService) ?? voices.find((v) => v.lang.toLowerCase().startsWith("de"));
}

/**
 * Liest absatzweise vor. Pause bricht den Absatz ab und beginnt ihn beim Fortsetzen neu,
 * weil speechSynthesis.pause() auf iOS und Android nicht zuverlässig arbeitet.
 */
export function ReadAloud({ parts, label = "Vorlesen" }: { parts: string[]; label?: string }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<State>("idle");
  const [index, setIndex] = useState(0);
  const [trouble, setTrouble] = useState(false);
  const run = useRef(0);
  const position = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) { setSupported(false); return; }
    window.speechSynthesis.getVoices();
  }, []);

  const halt = useCallback(() => {
    run.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const stop = () => { halt(); setState("idle"); position.current = 0; };
    window.addEventListener("pagehide", stop);
    return () => { window.removeEventListener("pagehide", stop); halt(); };
  }, [halt]);

  const speakFrom = useCallback((i: number) => {
    const synth = window.speechSynthesis;
    const id = ++run.current;
    synth.cancel();
    const step = (n: number) => {
      if (id !== run.current) return;
      if (n >= parts.length) { setState("idle"); position.current = 0; setIndex(0); return; }
      position.current = n;
      setIndex(n);
      const u = new SpeechSynthesisUtterance(parts[n]);
      u.lang = "de-DE";
      u.rate = 0.92;
      const voice = germanVoice();
      if (voice) u.voice = voice;
      u.onend = () => step(n + 1);
      u.onerror = (e) => {
        if (id !== run.current || e.error === "canceled" || e.error === "interrupted") return;
        setTrouble(true);
        setState("idle");
      };
      synth.speak(u);
    };
    setTrouble(false);
    setState("playing");
    step(i);
  }, [parts]);

  if (!supported) return <p className="read-status">Dieses Gerät kann nicht vorlesen. Lest einfach selbst, das ist auch schön.</p>;

  return (
    <div className="read" role="group" aria-label="Vorlesen">
      {state === "idle" && (
        <button type="button" className="btn small" onClick={() => speakFrom(0)}><PlayIcon /> {label}</button>
      )}
      {state === "playing" && (
        <button type="button" className="btn small" onClick={() => { halt(); setState("paused"); }}><PauseIcon /> Pause</button>
      )}
      {state === "paused" && (
        <button type="button" className="btn small" onClick={() => speakFrom(position.current)}><PlayIcon /> Weiter</button>
      )}
      {state !== "idle" && (
        <>
          <button type="button" className="btn ghost small" onClick={() => { halt(); setState("idle"); position.current = 0; setIndex(0); }}><StopIcon /> Stopp</button>
          <span className="read-status" role="status">Abschnitt {index + 1} von {parts.length}</span>
        </>
      )}
      {trouble && <span className="read-status" role="status">Das Vorlesen klappt gerade nicht. Lest gern selbst weiter.</span>}
    </div>
  );
}
