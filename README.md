# Gmail Theme Sync - Chrome Extension

An intermediate-level Chrome extension that automatically syncs Gmail's theme with your system preferences, providing a seamless dark mode experience. Seamlessly switches between light and dark mode based on your system settings, providing a consistent and comfortable email experience.

![Gmail Theme Sync](images/icon128.png)

## Features

- 🔄 Automatic theme synchronisation with system preferences
- 🌙 Smooth dark mode experience
- ☀️ Seamless light mode transition
- 🎨 Preserves image quality in emails
- ⚡ Instant theme switching
- 🔒 Privacy-focused (no data collection)

## Installation

### From Chrome Web Store

1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/gmail-theme-sync-control/kipklpaepncabfkopgefpnmnjldichab?authuser=0&hl=en-AU)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory
6. Ensure the extension is enabled

## Usage

Once installed, the extension works automatically:

1. Open Gmail in your browser
2. The theme will automatically match your system preferences
3. When you change your system theme, Gmail's theme will update automatically

## Technical Details

The extension uses CSS filters to implement the theme switching:

- Inverts colors for dark mode
- Preserves image quality in emails
- Maintains readability of all content
- Optimised for performance

## Browser Compatibility

- ✅ Google Chrome (version 88 or higher)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

## Limitations

- The extension uses color inversion for dark mode
- Background images in Gmail may be affected but mostly works at the moment
- Email content images, profile pictures, and label colors are preserved

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this extension helpful, consider:

- ⭐ Starring this repository
- 🐛 Reporting issues
- 💡 Suggesting improvements

## Acknowledgments

- Inspired by the need for better Gmail theming
- Built with modern web technologies
- Community-driven improvements

---

Made with ❤️ by [rkarthik.co](https://rkarthik.co) using [Claude.ai](https://claude.ai).
