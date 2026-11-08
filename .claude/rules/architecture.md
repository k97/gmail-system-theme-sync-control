# Architecture: storage is the only channel

The popup only writes `chrome.storage.sync` (`themePreference`, `themePaused`). The content script reads that storage on load and on `storage.onChanged`.

- Do not add `runtime.sendMessage`/`onMessage` or a background script to relay state.
- Why: `runtime.sendMessage` from the popup never reaches content scripts. Up to v1.1.1, pause silently failed in open Gmail tabs because of this. Background service workers are also the least reliable part of Safari web extensions.
- System mode is a `@media (prefers-color-scheme: dark)` wrapper around the injected CSS. Do not add a `matchMedia` listener for it.
