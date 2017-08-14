import * as electron from "electron";
import { autoUpdater } from "electron-updater";

export default class Updater {
  private quite = false;

  constructor() {
    autoUpdater.on("checking-for-update", () => {
      if (!this.quite) {
        this.sendStatus("Checking for update...");
      }
    });

    autoUpdater.on("update-available", (info) => {
      if (!this.quite) {
        this.sendStatus("Update available.");
      }
    });

    autoUpdater.on("update-not-available", (info) => {
      if (!this.quite) {
        this.sendStatus("Update not available.");
      }
    });

    autoUpdater.on("error", (err) => {
      if (!this.quite) {
        this.sendStatus("Error in auto-updater.", err.message);
      }
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.onUpdateAvailable(info);
    });
  }

  public checkForUpdates(quiet: boolean = false) {
    this.quite = quiet;
    autoUpdater.checkForUpdates();
  }

  private onUpdateAvailable(info: any) {
    const appName = electron.app.getName();
    const currentVersion = electron.app.getVersion();
    const lastestVersion = info.version;

    electron.dialog.showMessageBox({
      type: "info",
      message: `A new version of ${appName} is available!`,
      // tslint:disable-next-line:max-line-length
      detail: `${appName} ${lastestVersion} is available – you have ${currentVersion}. Would you like to update it now?`,
      buttons: ["Yes", "No"],
      defaultId: 0,
      cancelId: 1,
    }, (response) => {
      if (response === 0) {
        this.install();
      }
    });
  }

  private install() {
    autoUpdater.quitAndInstall();
  }

  private sendStatus(message: string, detail: string = "") {
    electron.dialog.showMessageBox({ message, detail });
  }
}
