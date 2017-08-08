import * as electron from 'electron';
import MainMenu from './main-menu';
import WindowManager from './window-manager';

export default class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private windowManager = new WindowManager();

  run() {
    electron.app.on('ready', () => {
      this.mainMenu.set();
      this.showOpenDialog();
      // electron.app.focus();
    });
    electron.app.on('activate', () => {
      if (this.windowManager.windows.length == 0) {
        this.showOpenDialog();
      }
    });
    electron.app.on('open-file', (event, path) => {
      this.openFile(path);
    });
    electron.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        electron.app.quit();
      }
    });
  }

  userDataPath(): string {
    return electron.app.getPath("userData");
  }

  openFile(path: string) {
    var window = this.windowManager.createWindow(path);

    window.once('ready-to-show', () => {
      window.show()
    });
  }

  showOpenDialog() {
    electron.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Realm Files', extensions: ['realm'] }]
    }, (selectedPaths) => {
      if (selectedPaths) {
        this.openFile(selectedPaths[0]);
      }
    });
  }
}
