# Safari packaging gotchas (Xcode 27.2)

- `xcrun safari-web-extension-packager` ignores `--bundle-identifier` for the app target. It builds the app ID from the prefix plus `--app-name`, while the extension gets `<id>.Extension`. The build then fails with "Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier". Fix: set the app target's `PRODUCT_BUNDLE_IDENTIFIER` to `co.rkarthik.gmail-theme-sync` by hand.
- `--copy-resources` bundles the whole input folder. Package an unzipped copy of the store zip, never the repo root.
- The packager runs outside the Claude Code sandbox: xcrun needs its cache in `/var/folders`, and the packager needs read access to the input path.
- Re-run the packager after every manifest change. It is the source of truth for which keys Safari does not support.
