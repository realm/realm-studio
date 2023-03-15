const electron = require('electron');
const fs = require('fs');
const path = require('path');

electron.app.once('ready', () => {
  // Signal that the app got ready by touching a file
  const appDataPath = electron.app.getAppPath();
  const p = path.resolve(appDataPath, '../../../../ready.signal');
  console.log('Writing signal to', p);
  /*
  electron.dialog.showMessageBox({
    message: `Writing to the ready signal: ${p}`,
  });
  */
  fs.writeFileSync(p, 'Hello from a future Cosmic Realms!', {
    encoding: 'utf8',
  });
  // Exit ...
  process.exit();
});
