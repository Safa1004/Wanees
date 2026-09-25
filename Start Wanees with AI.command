#!/bin/zsh
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:$PATH"
cd "${0:A:h}" || exit 1
python3 scripts/start-local-ai.py
