"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="wrap page"><div className="empty"><h1>Gerade klemmt etwas</h1><p>Versucht es gleich noch einmal. Die Häppchen laufen nicht weg.</p><button className="btn" onClick={reset}>Noch einmal versuchen</button></div></div>;
}
