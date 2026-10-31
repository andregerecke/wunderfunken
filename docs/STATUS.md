# Status

Stand: 31.10.2026

| Stufe | Stand |
| --- | --- |
| Lokal funktionsfähig | **Ja** |
| Deployment vorbereitet | **Ja**, GitHub Pages und Prüfschritte liegen vor |
| Veröffentlicht | **Nein** |
| Scheduler konfiguriert | **Nein** |
| Erfolgreich automatisch ausgeführt | **Nein** |

## Aufbau

Feste Seite auf GitHub Pages. Ein Claude-Lauf in der Cloud schreibt jeden Morgen eine Ausgabe (`docs/TAGESAUSGABE.md`) und liefert sie auf einen `claude/`-Zweig. `freigabe.yml` prüft sie und übernimmt sie nach `main`, `veroeffentlichen.yml` baut die Seite.

Die frühere Fassung mit Supabase, Vercel und OpenAI liegt lokal im Git-Tag `vor-github-umbau`.

## Abweichungen vom ursprünglichen Auftrag

Vom Nutzer am 31.10.2026 so entschieden: kein privates Elternkonto, die Seite ist öffentlich; gezeichnete SVG-Bilder statt KI-Bildern; Merkliste nur auf dem Gerät; Claude-Lauf als täglicher Dienst. Texte werden nicht von Menschen gegengelesen.

## Wiederaufnahme

```bash
export PATH="$PWD/.tools/node/bin:$PATH"
npm run typecheck && npm test
CONTENT_DIR=tests/fixtures/issues npm run build && npm run test:e2e
```
