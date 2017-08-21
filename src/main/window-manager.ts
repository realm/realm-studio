import { BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

import { WindowType } from "../windows/WindowType";

const isProduction = process.env.NODE_ENV === "production";

function getRendererHtmlPath() {
  const indexPath = isProduction ?
                    require("../../static/index.html") :
                    require("../../static/index.development.html");
  // __dirname is the directory of the bundle
  return path.resolve(__dirname, indexPath);
}

export default class WindowManager {
  public windows: Electron.BrowserWindow[] = [];

  public createWindow(representedPath: string, windowType: WindowType) {
    const window = new BrowserWindow({
      title: path.basename(representedPath),
      width: 800,
      height: 600,
      vibrancy: "light",
      show: false,
    });

    // Open up the dev tools, if not in production mode
    if (process.env.NODE_ENV !== "production") {
      window.once("ready-to-show", () => {
        window.webContents.openDevTools({
          mode: "detach",
        });
      });
    }

    if (process.platform === "darwin") {
      window.setRepresentedFilename(representedPath);
    }

    window.loadURL(url.format({
      pathname: getRendererHtmlPath(),
      protocol: "file:",
      query: {
        path: representedPath,
        windowType,
      },
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
