/**
 * Gmail Theme Sync & Control
 *
 * This script manages Gmail's theme based on user preferences or system settings.
 * By default, it syncs with the system theme, but also supports manual Light and Dark mode selection.
 */

// ============================================================================
// Constants
// ============================================================================

const STYLE_ID = 'gmail-theme-style';
const STORAGE_KEYS = ['themePreference', 'themePaused'];
const DARK_MODE_STYLES = `
  /* Invert the entire page */
  html {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Fix images and videos to appear normal */
  img, video {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Ensure SVG icons are properly inverted */
  img, svg {
    filter: invert(1) hue-rotate(180deg) !important;
  }

  /* Fix specific Gmail UI elements */
  .qj, .aEe, .aoH {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Applies the saved preference. The popup only writes storage; this is the single reader.
 * 'system' wraps the styles in a media query, so OS theme changes apply without JS.
 */
const applyTheme = ({ themePreference = 'system', themePaused = false } = {}) => {
  document.getElementById(STYLE_ID)?.remove();
  if (themePaused || themePreference === 'light') return;

  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.textContent = themePreference === 'dark'
    ? DARK_MODE_STYLES
    : `@media (prefers-color-scheme: dark) {${DARK_MODE_STYLES}}`;
  document.head.appendChild(styleElement);
};

const refreshTheme = () => chrome.storage.sync.get(STORAGE_KEYS, applyTheme);

// ============================================================================
// Initialize
// ============================================================================

refreshTheme();
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && STORAGE_KEYS.some((key) => key in changes)) refreshTheme();
});
