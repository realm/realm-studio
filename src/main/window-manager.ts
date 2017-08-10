import { BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

export default class WindowManager {
  public windows: Electron.BrowserWindow[] = [];

  public createWindow(representedPath: string) {
    const window = new BrowserWindow({
      title: path.basename(representedPath),
      width: 800,
      height: 600,
      vibrancy: "light",
      show: false,
    });

    if (process.platform === "darwin") {
      window.setRepresentedFilename(representedPath);
    }

    window.loadURL(url.format({
      pathname: path.join(__dirname, "../../static/index.html"),
      protocol: "file:",
      query: { path: representedPath },
      slashes: true,
    }));

    window.on("page-title-updated", (event) => {
      event.preventDefault();
    });

    window.on("closed", () => {
      const index = this.windows.indexOf(window);
      if (index > -1) {
        this.windows.splice(index, 1);
      }
    });

    this.windows.push(window);

    return window;
  }
}
