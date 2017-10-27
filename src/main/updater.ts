import * as electron from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export interface IDownloadProgress {
  total: number;
  downloaded: number;
}

export interface IUpdateStatus {
  state:
    | 'checking'
    | 'failed'
    | 'up-to-date'
    | 'available'
    | 'downloading'
    | 'downloaded'
    | 'installing';
  progress?: IDownloadProgress;
  error?: string;
  nextVersion?: string;
}

export default class Updater {
  private isBusy = false;
  private quite = false;
  private listeningWindows: Electron.BrowserWindow[] = [];
  private nextVersion?: string;

  constructor() {
    autoUpdater.on('checking-for-update', () => {
      this.isBusy = true;
      this.sendUpdateStatus({
        state: 'checking',
      });
    });

    autoUpdater.on('update-available', info => {
      // TODO: Consider reading the size from info here
      this.nextVersion = info.version;
      this.sendUpdateStatus({
        state: 'available',
        nextVersion: this.nextVersion,
      });
    });

    autoUpdater.on('update-not-available', info => {
      this.isBusy = false;
      this.sendUpdateStatus({
        state: 'up-to-date',
      });
    });

    autoUpdater.on('download-progress', progress => {
      this.sendUpdateStatus({
        state: 'downloading',
        progress: {
          total: progress.total,
          downloaded: progress.transferred,
        },
      });
    });

    autoUpdater.on('error', err => {
      this.isBusy = false;
      if (!this.quite) {
        this.showError('Error occurred while updating', err.message);
      }
      this.sendUpdateStatus({
        state: 'failed',
        error: err.message,
      });
    });

    autoUpdater.on('update-downloaded', info => {
      this.sendUpdateStatus({
        state: 'downloaded',
        nextVersion: this.nextVersion,
      });
      this.onUpdateAvailable(info);
    });
  }

  public destroy() {
    autoUpdater.removeAllListeners('checking-for-update');
    autoUpdater.removeAllListeners('download-progress');
    autoUpdater.removeAllListeners('error');
    autoUpdater.removeAllListeners('update-available');
    autoUpdater.removeAllListeners('update-downloaded');
    autoUpdater.removeAllListeners('update-not-available');
  }

  public addListeningWindow(window: Electron.BrowserWindow) {
    this.listeningWindows.push(window);
  }

  public removeListeningWindow(window: Electron.BrowserWindow) {
    const index = this.listeningWindows.indexOf(window);
    this.listeningWindows.splice(index, 1);
  }

  public checkForUpdates(quiet: boolean = false) {
    // Checking this prevents two updates at the same time
    if (!this.isBusy) {
      this.quite = quiet;
      if (isProduction) {
        autoUpdater.checkForUpdates();
      } else {
        this.performFakeUpdate();
      }
    }
  }

  public performFakeUpdate() {
    const PROGRESS_POLL_DELAY = 250;
    // Wait 1 second
    setTimeout(() => {
      this.nextVersion = 'v.1.2.3';
      this.sendUpdateStatus({
        state: 'available',
        nextVersion: this.nextVersion,
      });
      const total = 60 * 1024 * 1024;
      const duration = 10000;
      let downloaded = 0;
      const timer = setInterval(() => {
        downloaded += total / duration * PROGRESS_POLL_DELAY;
        downloaded = Math.min(total, downloaded); // Enforcing the upper bound
        this.sendUpdateStatus({
          state: 'downloading',
          nextVersion: this.nextVersion,
          progress: {
            downloaded,
            total,
          },
        });
        // Stop the timer - and go to installing
        if (downloaded === total) {
          clearTimeout(timer);
          this.sendUpdateStatus({
            state: 'downloaded',
            nextVersion: this.nextVersion,
          });
          setTimeout(() => {
            this.sendUpdateStatus({
              state: 'installing',
              nextVersion: this.nextVersion,
            });
            setTimeout(() => {
              this.sendUpdateStatus({
                state: 'up-to-date',
              });
            }, 2000);
          }, 5000);
        }
      }, PROGRESS_POLL_DELAY);
    }, 1000);
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
