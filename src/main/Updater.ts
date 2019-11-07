////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import electron from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';

import { WindowManager } from './WindowManager';

const isDevelopment = process.env.NODE_ENV === 'development';

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

export class Updater {
  private isBusy = false;
  private quite = false;
  private listeningWindows: Electron.BrowserWindow[] = [];
  private nextVersion?: string;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;

    // Disabling auto download of updates
    autoUpdater.autoDownload = false;

    // Registering event listners
    autoUpdater.on('checking-for-update', () => {
      this.isBusy = true;
      this.sendUpdateStatus({
        state: 'checking',
      });
    });

    autoUpdater.on('update-available', (info: UpdateInfo) => {
      this.nextVersion = info.version;
      this.sendUpdateStatus({
        state: 'available',
        nextVersion: this.nextVersion,
      });
      this.onUpdateAvailable(info);
    });

    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
      this.isBusy = false;
      this.sendUpdateStatus({
        state: 'up-to-date',
      });
    });

    autoUpdater.on('download-progress', progress => {
      this.sendUpdateStatus({
        state: 'downloading',
        nextVersion: this.nextVersion,
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

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      this.sendUpdateStatus({
        state: 'downloaded',
        nextVersion: this.nextVersion,
      });
      this.onUpdateDownloaded(info);
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
      if (isDevelopment) {
        this.performFakeUpdate();
      } else {
        autoUpdater.checkForUpdates();
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
        downloaded += (total / duration) * PROGRESS_POLL_DELAY;
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

  private askToUpdate(lastestVersion: string) {
    if (process.env.REALM_STUDIO_DISABLE_UPDATE_PROMPT) {
      return true;
    } else {
      const appName = electron.app.getName();
      const currentVersion = electron.app.getVersion();
      return (
        electron.dialog.showMessageBox({
          type: 'info',
          message: `A new version of ${appName} is available!`,
          detail: `${appName} ${lastestVersion} is available – you have ${currentVersion}.\nWould you like to update it now?`,
          buttons: ['Yes', 'No'],
          defaultId: 0,
          cancelId: 1,
        }) === 0
      );
    }
  }

  private askToRestart(lastestVersion: string) {
    if (process.env.REALM_STUDIO_DISABLE_UPDATE_PROMPT) {
      return true;
    } else {
      const appName = electron.app.getName();
      return (
        electron.dialog.showMessageBox({
          type: 'info',
          message: `A new version of ${appName} is downloaded!`,
          detail: `${appName} ${lastestVersion} is downloaded.\nClick "Ok" to quit and restart Realm Studio.`,
          buttons: ['Ok'],
          defaultId: 0,
        }) === 0
      );
    }
  }

  private onUpdateAvailable(info: UpdateInfo) {
    // Show a dialog synchronously
    const shouldDownload = this.askToUpdate(info.version);
    // Quit and install
    if (shouldDownload) {
      autoUpdater.downloadUpdate();
    } else {
      this.isBusy = false;
      // If the user rejects an update, we'll tell the window manager
      this.windowManager.setPendingUpdate(true);
    }
  }

  private onUpdateDownloaded(info: UpdateInfo) {
    // Show a dialog synchronously
    const shouldQuitAndInstall = this.askToRestart(info.version);
    // Quit and install
    if (shouldQuitAndInstall) {
      autoUpdater.quitAndInstall(true, true);
    }
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
