# Safari packaging gotchas (Xcode 27.2)

- `xcrun safari-web-extension-packager` ignores `--bundle-identifier` for the app target. It builds the app ID from the prefix plus `--app-name`, while the extension gets `<id>.Extension`. The build then fails with "Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier". Fix: set the app target's `PRODUCT_BUNDLE_IDENTIFIER` to `co.rkarthik.gmail-theme-sync` by hand.
- `--copy-resources` bundles the whole input folder. Package an unzipped copy of the store zip, never the repo root.
- The packager runs outside the Claude Code sandbox: xcrun needs its cache in `/var/folders`, and the packager needs read access to the input path.
- Re-run the packager after every manifest change. It is the source of truth for which keys Safari does not support.
- The App Store Connect web Packager was not usable for this account in November 2026: it rejected the `.zip` ("File has an invalid extension") and pointed to the regular upload tools. Safari ships from the Xcode project in `safari/`.
- `safari/` is committed with these fixes already applied. Re-apply them only if the project is ever regenerated with the packager:
  - The app's `PRODUCT_BUNDLE_IDENTIFIER` is `co.rkarthik.gmail-theme-sync` (see the bug above).
  - `DEVELOPMENT_TEAM` is `R68RHN3HF5`, and `INFOPLIST_KEY_LSApplicationCategoryType` is `public.app-category.productivity`. The Mac App Store requires a category.
  - `MACOSX_DEPLOYMENT_TARGET` is `13.0` for both targets. The packager defaults to the current macOS, which hides the app from everyone on an older version.
- The extension's `Resources/` folder inside `safari/` is git-ignored. The repo root is the only source. Run `safari/sync.sh` before every Safari build: it copies the root files in and applies the Safari-only manifest `description`. Safari rejects a description longer than 112 characters, while Chrome allows 132.
- A new extension file at the root must be added in three places: the zip command in `CLAUDE.md`, the `rsync` list in `safari/sync.sh`, and the extension target's resources in `project.xcproj`.
- For every upload, set `MARKETING_VERSION` to the manifest version and increase `CURRENT_PROJECT_VERSION` in `project.xcproj`.
- Archive and upload (paths are relative to `safari/Gmail Theme Sync/`):
  `xcodebuild archive -scheme "Gmail Theme Sync" -configuration Release -destination "generic/platform=macOS" -archivePath ../build/<name>.xcarchive -allowProvisioningUpdates`, then
  `xcodebuild -exportArchive -archivePath ../build/<name>.xcarchive -exportOptionsPlist ../ExportOptions.plist -exportPath ../build/export -allowProvisioningUpdates`.
