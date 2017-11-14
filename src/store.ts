// TODO: Replace this with a Realm as soon as we don't need to CWD in the renderer.
// @see https://github.com/realm/realm-studio/blob/master/src/renderer.tsx#L15-L30

import ElectronStore = require('electron-store');
const store = new ElectronStore();
export { store };
