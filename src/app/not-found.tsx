import Link from "next/link";

export default function NotFound() {
  return <div className="wrap page"><div className="empty"><h1>Dieses Häppchen gibt es nicht</h1><p>Vielleicht wartet ein anderes Wunder auf euch.</p><Link className="btn" href="/">Zur Startseite</Link></div></div>;
}
