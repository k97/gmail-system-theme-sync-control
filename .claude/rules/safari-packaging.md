# Safari packaging gotchas (Xcode 27.2)

- `xcrun safari-web-extension-packager` ignores `--bundle-identifier` for the app target. It builds the app ID from the prefix plus `--app-name`, while the extension gets `<id>.Extension`. The build then fails with "Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier". Fix: set the app target's `PRODUCT_BUNDLE_IDENTIFIER` to `co.rkarthik.gmail-theme-sync` by hand.
- `--copy-resources` bundles the whole input folder. Package an unzipped copy of the store zip, never the repo root.
- The packager runs outside the Claude Code sandbox: xcrun needs its cache in `/var/folders`, and the packager needs read access to the input path.
- Re-run the packager after every manifest change. It is the source of truth for which keys Safari does not support.
- The App Store Connect web Packager was not usable for this account in November 2026: it rejected the `.zip` ("File has an invalid extension") and pointed to the regular upload tools. Ship with the local Xcode project at `~/Work/gmail-theme-sync-safari`, which is outside this repo and not under git.
- Patches that project needs after every regeneration (`--copy-resources` copies, so repo edits do not flow in):
  - The app's `PRODUCT_BUNDLE_IDENTIFIER` must be `co.rkarthik.gmail-theme-sync` (see the bug above).
  - Set `DEVELOPMENT_TEAM` to `R68RHN3HF5`, and `INFOPLIST_KEY_LSApplicationCategoryType` to `public.app-category.productivity`. The Mac App Store requires a category.
  - Set `MACOSX_DEPLOYMENT_TARGET` to `13.0` for both targets. The packager defaults to the current macOS, which hides the app from everyone on an older version.
  - Set `MARKETING_VERSION` to the manifest version, and increase `CURRENT_PROJECT_VERSION` on every upload.
  - Safari rejects a manifest `description` longer than 112 characters. Chrome's limit is 132. The owner chose to shorten it only in the Safari copy (`Resources/manifest.json`), to "Automatically syncs Gmail with your system theme, or keeps it in light or dark mode for easier reading." Re-apply this after copying in new files.
- Archive and upload:
  `xcodebuild archive -scheme "Gmail Theme Sync" -configuration Release -destination "generic/platform=macOS" -archivePath <path> -allowProvisioningUpdates`, then
  `xcodebuild -exportArchive -archivePath <path> -exportOptionsPlist <plist with method app-store-connect, destination upload, teamID> -exportPath <dir> -allowProvisioningUpdates`.
