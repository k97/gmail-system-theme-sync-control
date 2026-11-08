/**
 * Gmail System Theme Sync Extension
 * Popup UI Controller
 */

// DOM Elements
const elements = {
    segmentControl: document.getElementById('segmentControl'),
    segmentOptions: document.querySelectorAll('.segment-option'),
    pauseBtn: document.getElementById('pauseBtn'),
    iconPlay: document.querySelector('#pauseBtn .icon-play'),
    iconPause: document.querySelector('#pauseBtn .icon-pause'),
    tooltip: document.querySelector('#pauseBtn .tooltip'),
    themeControl: document.getElementById('themeControl'),
    version: document.getElementById('version')
};

// State
const state = {
    isPaused: false
};

/**
 * Updates the UI to reflect the current pause state
 */
function updatePauseUI() {
    const {isPaused} = state;
    const {pauseBtn, iconPlay, iconPause, tooltip, themeControl, segmentOptions} = elements;

    // Update pause button state
    pauseBtn.classList.toggle('paused', isPaused);
    iconPlay.style.display = isPaused ? '' : 'none';
    iconPause.style.display = isPaused ? 'none' : '';
    tooltip.textContent = isPaused ? 'Resume extension' : 'Pause extension';
    pauseBtn.setAttribute('aria-label', isPaused ? 'Resume extension' : 'Pause extension');

    // Dim and disable theme controls while paused
    themeControl.classList.toggle('paused', isPaused);
    segmentOptions.forEach(option => { option.disabled = isPaused; });
}

/**
 * Sets the active theme and updates UI accordingly
 * @param {string} theme - The theme to set ('system', 'light', or 'dark')
 */
function setActiveTheme(theme) {
    elements.segmentOptions.forEach((option, index) => {
        const isActive = option.dataset.theme === theme;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-pressed', isActive);
        if (isActive) elements.segmentControl.style.setProperty('--index', index);
    });
}

/**
 * Handles pause state changes
 */
function handlePauseStateChange() {
    state.isPaused = !state.isPaused;

    // Save state; Gmail tabs pick it up via storage.onChanged
    chrome.storage.sync.set({
        themePaused: state.isPaused
    });

    // Update UI
    updatePauseUI();
}

/**
 * Handles theme selection
 * @param {string} selectedTheme - The selected theme
 */
function handleThemeSelection(selectedTheme) {
    if (state.isPaused) return;

    setActiveTheme(selectedTheme);
    chrome.storage.sync.set({
        themePreference: selectedTheme
    });
}

// Initialize extension state
chrome.storage.sync.get(['themePreference', 'themePaused'], (result) => {
    state.isPaused = !!result.themePaused;

    updatePauseUI();
    setActiveTheme(result.themePreference || 'system');
    requestAnimationFrame(() => elements.segmentControl.classList.add('animate'));
});

elements.version.textContent = `v${chrome.runtime.getManifest().version}`;

// Event Listeners
elements.pauseBtn.addEventListener('click', handlePauseStateChange);

elements.segmentOptions.forEach(option => {
    option.addEventListener('click', () => handleThemeSelection(option.dataset.theme));
});