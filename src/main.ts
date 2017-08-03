import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let chooserWindow: Electron.BrowserWindow | null = null;
let studioWindows: Electron.BrowserWindow[] = [];

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

const createStudioWindow = async () => {
  // Create the browser window.
  let studioWindow = new BrowserWindow({
    width: 1200,
    height: 780,
    movable: true
  });

  // and load the index.html of the app.
  studioWindow.loadURL(`file://${__dirname}/app.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    studioWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  studioWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    studioWindow = null;
  });
};

const createChooserWindow = async () => {
  // Create the browser window.
  chooserWindow = new BrowserWindow({
    width: 700,
    height: 400,
    resizable: false,
    movable: true,
    titleBarStyle: 'hidden',
    transparent: true
  });

  // and load the index.html of the app.
  chooserWindow.loadURL(`file://${__dirname}/chooser.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    chooserWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  chooserWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    chooserWindow = null;
  });

  ipcMain.on('open-realm-files', function () {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });
  });

  ipcMain.on('create-realm-file', function () {
    dialog.showSaveDialog({ title: 'Create a Realm File' }, function (filename: string) {
      // const regexForFileExtension = /(?:\.([^.]+))?$/;
      // const extension: string | null | undefined = regexForFileExtension.exec(filename)[1];
      // if (!(extension && extension === "realm")) {
      // }
      console.log(filename);
    });
  });

  ipcMain.on('connect-to-realm-server', () => {
    createStudioWindow();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createChooserWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (chooserWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
