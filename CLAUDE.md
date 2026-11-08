# Gmail Theme Sync & Control

The popup UI shows the short name "Gmail Theme Sync". Keep the manifest `name` unchanged: it is the Chrome Web Store listing name.

A Manifest V3 browser extension for Chrome and Safari that inverts Gmail's colours to follow the system theme, or forces Light or Dark. It is plain JS with no build step and no dependencies. The extension files live at the repo root, and `safari/` holds the Xcode wrapper app for the Mac App Store.

Keep `privacy-policy.md` at the repo root. Its GitHub URL is registered with the App Store.

## Commands

- `zip -r gmail-theme-sync.zip manifest.json contentScript.js popup.html popup.js images` builds the Chrome Web Store upload. Never zip the repo root: that would ship `docs/`, `test/`, `safari/` and the README.
- `safari/sync.sh` copies the extension into the Safari project. Run it before every Safari build. See [Safari packaging](.claude/rules/safari-packaging.md) for archiving and uploading.

## Rules

- [Coding guardrails](.claude/rules/coding-guardrails.md): think first, keep it simple, make surgical changes, verify.
- [Architecture](.claude/rules/architecture.md): storage is the only channel between the popup and the content script.
- [Safari packaging](.claude/rules/safari-packaging.md): workarounds for the packager. See also [docs/safari-plan.md](docs/safari-plan.md).

## Gates

Run the `stage-gate` skill at each boundary, even when the work looks finished — dispatch a fresh reviewer, do not gate your own work: plan written → `--plan`, code written before push → `--dev`, merged → `--release`.

## Verification

- `node test/contentScript.check.js` checks the theme logic against a stubbed DOM and storage.
- `for f in popup.js contentScript.js; do node --check "$f"; done` checks syntax. `node --check` checks only its first argument.
- `python3 -c "import json;json.load(open('manifest.json'))"` checks that the manifest is valid JSON.
- Manual check: load the extension unpacked in Chrome and confirm that System, Light, Dark and Pause work across open Gmail tabs.
