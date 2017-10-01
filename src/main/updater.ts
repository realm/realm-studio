import * as electron from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';

export interface IUpdateStatus {
  checking: boolean;
  available?: boolean;
  error?: string;
}

export default class Updater {
  private quite = false;
  private listeningWindows: Electron.BrowserWindow[] = [];

  constructor() {
    autoUpdater.on('checking-for-update', () => {
      this.sendUpdateStatus({
        checking: true,
      });
    });

    autoUpdater.on('update-available', info => {
      this.sendUpdateStatus({
        checking: false,
        available: true,
      });
    });

    autoUpdater.on('update-not-available', info => {
      this.sendUpdateStatus({
        checking: false,
        available: false,
      });
    });

    autoUpdater.on('error', err => {
      if (!this.quite) {
        this.showError('Error occurred while updating', err.message);
      }
      this.sendUpdateStatus({
        checking: false,
        error: err.message,
      });
    });

    autoUpdater.on('update-downloaded', info => {
      this.onUpdateAvailable(info);
    });
  }

  public destroy() {
    autoUpdater.removeAllListeners('checking-for-update');
    autoUpdater.removeAllListeners('update-available');
    autoUpdater.removeAllListeners('update-not-available');
    autoUpdater.removeAllListeners('error');
    autoUpdater.removeAllListeners('update-downloaded');
  }

  public addListeningWindow(window: Electron.BrowserWindow) {
    this.listeningWindows.push(window);
  }

  public removeListeningWindow(window: Electron.BrowserWindow) {
    const index = this.listeningWindows.indexOf(window);
    this.listeningWindows.splice(index, 1);
  }

  public checkForUpdates(quiet: boolean = false) {
    this.quite = quiet;
    autoUpdater.checkForUpdates();
  }

  private onUpdateAvailable(info: any) {
    const appName = electron.app.getName();
    const currentVersion = electron.app.getVersion();
    const lastestVersion = info.version;

    electron.dialog.showMessageBox(
      {
        type: 'info',
        message: `A new version of ${appName} is available!`,
        detail: `${appName} ${lastestVersion} is available – you have ${currentVersion}. Would you like to update it now?`,
        buttons: ['Yes', 'No'],
        defaultId: 0,
        cancelId: 1,
      },
      response => {
        if (response === 0) {
          this.install();
        }
      },
    );
  }

  private install() {
    autoUpdater.quitAndInstall();
  }

  private showError(message: string, detail: string = '') {
    electron.dialog.showMessageBox({
      type: 'error',
      message,
      detail,
    });
  }

  private sendUpdateStatus(status: IUpdateStatus) {
    this.listeningWindows.forEach(window => {
      window.webContents.send('update-status', status);
    });
  }
}
