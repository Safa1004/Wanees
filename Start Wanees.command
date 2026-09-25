#!/bin/zsh
set -e
cd -- "$(dirname -- "$0")"
export PATH="/usr/local/bin:/usr/local/share/dotnet:/opt/homebrew/bin:$PATH"
if ! command -v dotnet >/dev/null 2>&1; then
  echo "Wanees needs the .NET 10 runtime. See README.md."
  read -r "reply?Press Return to close."
  exit 1
fi
python3 scripts/serve.py
