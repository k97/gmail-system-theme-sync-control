#!/bin/sh
# Copies the extension into the Safari project. The repo root is the only source:
# the Resources folder is git-ignored and rebuilt here, then gets the Safari-only manifest patch.
set -eu
cd "$(dirname "$0")/.."
RES="safari/Gmail Theme Sync/Gmail Theme Sync Extension/Resources"
mkdir -p "$RES"
rsync -a --delete manifest.json contentScript.js popup.html popup.js images "$RES/"
python3 - "$RES/manifest.json" <<'PY'
import json, sys
path = sys.argv[1]
manifest = json.load(open(path))
# Safari rejects descriptions over 112 characters (Chrome allows 132); the owner chose a Safari-only text.
manifest["description"] = "Automatically syncs Gmail with your system theme, or keeps it in light or dark mode for easier reading."
assert len(manifest["description"]) <= 112, "Safari manifest description must be 112 characters or fewer"
json.dump(manifest, open(path, "w"), indent=2)
print("Safari resources synced, version", manifest["version"])
PY
