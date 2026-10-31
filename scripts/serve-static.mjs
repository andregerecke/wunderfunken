// Liefert den fertigen Ordner `out` so aus, wie GitHub Pages es tut.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve("out");
const port = Number(process.argv[2] ?? 3000);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain", ".mp3": "audio/mpeg" };

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const base = path.join(root, url);
  const file = [base, `${base}.html`, path.join(base, "index.html")].find((f) => f.startsWith(root) && existsSync(f) && statSync(f).isFile());
  const target = file ?? path.join(root, "404.html");
  res.writeHead(file ? 200 : 404, { "content-type": TYPES[path.extname(target)] ?? "application/octet-stream" });
  createReadStream(target).pipe(res);
}).listen(port);
