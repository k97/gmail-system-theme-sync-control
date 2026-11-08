// Self-check for contentScript.js with a stubbed DOM and chrome.storage. Run: node test/contentScript.check.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let store = {};
let listener;
let el = null;
global.document = {
  getElementById: () => el,
  createElement: () => ({ remove() { el = null; } }),
  head: { appendChild: (e) => { el = e; } },
};
global.chrome = {
  storage: {
    sync: { get: (_keys, cb) => cb({ ...store }) },
    onChanged: { addListener: (fn) => { listener = fn; } },
  },
};
eval(fs.readFileSync(path.join(__dirname, '..', 'contentScript.js'), 'utf8'));

const set = (o) => {
  Object.assign(store, o);
  listener(Object.fromEntries(Object.keys(o).map((k) => [k, {}])), 'sync');
};

assert.match(el.textContent, /^@media \(prefers-color-scheme: dark\)/, 'default is system');
set({ themePreference: 'dark' });
assert(!el.textContent.startsWith('@media'), 'dark is unconditional');
set({ themePreference: 'light' });
assert.equal(el, null, 'light removes styles');
set({ themePreference: 'dark', themePaused: true });
assert.equal(el, null, 'paused removes styles');
set({ themePaused: false });
assert(el, 'resume restores dark');
listener({ themePaused: {} }, 'local');
assert(el, 'ignores other storage areas');
console.log('contentScript checks pass');
