# Safari port plan

Goal: ship the same extension code to Safari on macOS, without adding an Xcode project to this repo.

Decisions:

- **One codebase.** The Chrome files are the Safari files. There is no build step and no fork.
- **macOS only to start.** The inversion CSS was tuned on desktop Gmail. iOS mobile Gmail web uses a different DOM, so iOS waits until there is demand for it.
- **Package with the App Store Connect web packager.** Apple turns an uploaded zip into a signed wrapper app. The local `xcrun` packager is the fallback.

## Why the code is already Safari-friendly

The background service worker was removed. The popup now writes `chrome.storage.sync`, and the content script reacts to `storage.onChanged`. Service workers are the least reliable part of Safari web extensions (for example, you cannot open a debug window for them), so there is nothing left there to go wrong.

The extension uses only `storage`, `storage.onChanged`, `runtime.getManifest` and a static content script.

## Steps

### 1. Test locally (no Apple account needed)

1. Safari > Settings > Advanced: turn on "Show features for web developers".
2. Safari > Settings > Developer: click **Add Temporary Extension…**, then choose this repo folder (the one with `manifest.json`).
3. Turn the extension on in Safari > Settings > Extensions, and allow it on `mail.google.com`.
4. Check each of these:
   - System, Light and Dark each apply. With System selected, the theme follows a change in macOS appearance without a reload.
   - Pause removes the theme in every open Gmail tab. Resume brings it back.
   - The theme preference survives a Safari restart. If it does not, `storage.sync` is not behaving in Safari: switch to `storage.local`.
   - The popup renders correctly in light and dark mode, and its footer shows the manifest version.

Temporary extensions unload when Safari quits, so add the extension again after each restart.

### 2. Package and distribute

1. In App Store Connect, go to Apps > (+) > New App. Choose the macOS platform. Use the bundle ID `co.rkarthik.gmail-theme-sync` (or similar) and give it a SKU.
2. Build the upload zip from the repo root:

   ```sh
   zip -r gmail-theme-sync.zip manifest.json contentScript.js popup.html popup.js images
   ```

3. Go to Users and Access > Xcode Cloud > Safari Web Extension Packager > Upload. The Xcode Cloud tab moved under Users and Access in 2026, so Apple's older docs still point to the old location.
4. Install the packaged build through TestFlight, then repeat the checks in step 1.
5. Fill in the App Store metadata, screenshots and privacy answers ("Data Not Collected"), then submit for review.

Packaging time counts against the 25 free Xcode Cloud hours per month that come with the Developer Program.

### Fallback: local Xcode packager

Use this if the web packager is missing or its export fails. Both problems were reported on the Apple forums in September 2026.

```sh
xcrun safari-web-extension-packager . --macos-only --no-open --swift \
  --app-name "Gmail Theme Sync" \
  --bundle-identifier co.rkarthik.gmail-theme-sync \
  --project-location ../gmail-theme-sync-safari
```

The project stays outside this repo. By default it references the extension files rather than copying them, so changes here flow straight into it. Archive and upload it from Xcode.

Two problems turned up when this was tried with Xcode 27.2:

- **The app's bundle ID comes out wrong.** The packager builds the app ID from the prefix plus the app name (`co.rkarthik.Gmail-Theme-Sync`). The extension ID is the given ID plus `.Extension`. The build then fails with "Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier". To fix it, set the app target's `PRODUCT_BUNDLE_IDENTIFIER` to `co.rkarthik.gmail-theme-sync` in Xcode.
- **The extension bundles everything in the folder,** including `docs/`, `README.md` and `LICENSE`. To avoid that, unzip the upload zip from step 2 into a temporary folder and run the packager on that folder instead of `.`.

## Verified with Xcode 27.2 / Safari 27.2 (2026-11-08)

- The packager's only manifest warning was `incognito`. That key has been removed: with no background page, `"split"` did nothing in Chrome. `minimum_chrome_version` is not flagged.
- The packager generated the macOS app icon set from the manifest `icons`. Its 512@2x icon is 1024px, so `images/icon1024.png` covers the App Store icon.
- The generated macOS app builds, with ad-hoc signing, once the bundle ID fix above is applied.
- The step 1 checks pass in Safari as a temporary extension, tested by the owner on 2026-11-08 with v1.2.1. `storage.sync` keeps the settings across a Safari restart.

## Still open

- Once Safari ships, add a Safari line to Browser Compatibility in the README.

## Sources

- [Packaging and distributing Safari web extensions with App Store Connect](https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect)
- [Packaging a web extension for Safari](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari)
- [Forum: Packager moved under Users and Access](https://developer.apple.com/forums/thread/845245)
- [Forum: Packager section missing](https://developer.apple.com/forums/thread/845035)
- [Loading temporary extensions in Safari 26](https://www.stefanvd.net/blog/?p=2105)
