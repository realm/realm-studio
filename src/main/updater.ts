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
  private static PROGRESS_POLL_DELAY = 250;
  // TODO: We should read the actual size from the available update to be downloaded.
  private static EXPECTED_PACKAGE_SIZE = 65 * 1024 * 1024; // ~65mb

  private isBusy = false;
  private quite = false;
  private listeningWindows: Electron.BrowserWindow[] = [];
  private progressTimer: number;
  private memoryUsageAtStart?: number;
  private nextVersion?: string;

  constructor() {
    autoUpdater.on('checking-for-update', () => {
      this.isBusy = true;
      this.sendUpdateStatus({
        state: 'checking',
      });

      // If we are developing - perform a fake update
      if (!isProduction) {
        this.performFakeUpdate();
      }
    });

    autoUpdater.on('update-available', info => {
      // TODO: Consider reading the size from info here
      this.nextVersion = info.version;
      this.sendUpdateStatus({
        state: 'available',
        nextVersion: this.nextVersion,
      });
      this.startProgressPolling();
    });

    autoUpdater.on('update-not-available', info => {
      this.isBusy = false;
      this.sendUpdateStatus({
        state: 'up-to-date',
      });
    });

    autoUpdater.on('error', err => {
      this.isBusy = false;
      this.stopProgressPolling();
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
        progress: {
          total: Updater.EXPECTED_PACKAGE_SIZE,
          downloaded: Updater.EXPECTED_PACKAGE_SIZE,
        },
      });
      this.stopProgressPolling();
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
    // Checking this prevents two updates at the same time
    if (!this.isBusy) {
      this.quite = quiet;
      autoUpdater.checkForUpdates();
    }
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

  private pollForProgress() {
    // We are estimating the progress by comparing the rise of memory usage to the size of the
    // package being downloaded. This is because update progress notifications is currently not
    // supported by the autoUpdater on all platforms.
    // This is a somewhat bold assumption as garbage collection might free memory elsewhere
    // while we're downloading.
    const usage = process.memoryUsage().rss;
    const total = Updater.EXPECTED_PACKAGE_SIZE;
    if (this.memoryUsageAtStart) {
      const atStart = this.memoryUsageAtStart;
      // Calculate a bounded estimate on the downloaded bytes
      const downloaded = Math.min(Math.max(0, usage - atStart), total);
      this.sendUpdateStatus({
        state: 'downloading',
        nextVersion: this.nextVersion,
        progress: {
          downloaded,
          total,
        },
      });
    }
  }

  private startProgressPolling() {
    // Save the memory usage before the download begins
    this.memoryUsageAtStart = process.memoryUsage().rss;
    // Start an interval timer polling for changes in memory usage
    this.progressTimer = setInterval(
      this.pollForProgress.bind(this),
      Updater.PROGRESS_POLL_DELAY,
    );
  }

  private stopProgressPolling() {
    clearTimeout(this.progressTimer);
    this.memoryUsageAtStart = undefined;
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

  private performFakeUpdate() {
    // Wait 1 second
    setTimeout(() => {
      this.nextVersion = 'v.1.2.3';
      this.sendUpdateStatus({
        state: 'available',
        nextVersion: this.nextVersion,
      });
      const total = Updater.EXPECTED_PACKAGE_SIZE;
      const duration = 10000;
      let downloaded = 0;
      const timer = setInterval(() => {
        downloaded += total / duration * Updater.PROGRESS_POLL_DELAY;
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
            progress: {
              total: Updater.EXPECTED_PACKAGE_SIZE,
              downloaded: Updater.EXPECTED_PACKAGE_SIZE,
            },
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
      }, Updater.PROGRESS_POLL_DELAY);
    }, 1000);
  }
}
