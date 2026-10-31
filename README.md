# Wunderfunken

Jeden Tag ein bisschen schlauer. Ein tägliches Entdeckungsritual als kleines Wissensmagazin.

## Auf dem Mac ansehen

Im Finder `vorschau.command` doppelklicken. Beim ersten Mal fragt macOS eventuell nach: Rechtsklick → Öffnen.
Die App läuft dann unter http://localhost:3000. Beenden: Terminalfenster schließen.

Oder im Terminal in diesem Ordner:

```bash
export PATH="$PWD/.tools/node/bin:$PATH"
npm run build && npm run start
```

Node.js liegt nur in diesem Projekt unter `.tools/` (Git ignoriert es). Fehlt der Ordner, die LTS-Version von https://nodejs.org installieren. Sonst nötig: nichts.

## Prüfen

```bash
export PATH="$PWD/.tools/node/bin:$PATH"
npm run typecheck && npm test
CONTENT_DIR=tests/fixtures/issues npm run build && npm run test:e2e
```

## Betrieb

Die App ist eine feste Seite auf GitHub Pages. Jeden Morgen schreibt ein Claude-Lauf eine neue Ausgabe, Prüfschritte auf GitHub geben sie frei. Stand: [docs/STATUS.md](docs/STATUS.md), Anleitung des Laufs: [docs/TAGESAUSGABE.md](docs/TAGESAUSGABE.md).

## Aufbau

- `src/domain`: fachliche Regeln (Zeit, Themenmix, Sicherheit, Beitragsformat, Prüfung der Ausgaben)
- `src/content`: 24 Startbeiträge, Quellen; `npm run sources:check` ruft alle Quellen neu ab
- `content/issues`: die täglichen Ausgaben
- `scripts/illustrations.mjs`: zeichnet die SVG-Illustrationen des Startbestands
- `.github/workflows`: Freigabe und Veröffentlichung
