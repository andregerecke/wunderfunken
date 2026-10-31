#!/bin/zsh
# Doppelklick startet die lokale Demo unter http://localhost:3000
cd "$(dirname "$0")"
export PATH="$PWD/.tools/node/bin:$PATH"
command -v node >/dev/null || { echo "Node.js fehlt. Siehe README.md"; read; exit 1; }
[ -d node_modules ] || npm install
npm run build || exit 1
(sleep 3; open http://localhost:3000) &
npm run start
