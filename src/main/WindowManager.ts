import { BrowserWindow, screen, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { getWindowOptions, WindowType } from '../windows/WindowType';

const isProduction = process.env.NODE_ENV === 'production';

function getRendererHtmlPath() {
  const indexPath = isProduction
    ? require('../../static/index.html')
    : require('../../static/index.development.html');
  // __dirname is the directory of the bundle
  return path.resolve(__dirname, indexPath);
}

export class WindowManager {
  public windows: Electron.BrowserWindow[] = [];

  public createWindow(windowType: WindowType, options: any = {}) {
    const window = new BrowserWindow({
      title: 'Realm Studio',
      width: 800,
      height: 600,
      vibrancy: 'light',
      show: false,
      ...getWindowOptions(windowType, options),
    });

    // Open up the dev tools, if not in production mode
    if (!isProduction && process.env.OPEN_DEV_TOOLS) {
      window.webContents.once('did-finish-load', () => {
        window.webContents.openDevTools({
          mode: 'detach',
        });
        // Focus to original window, to prevent the dev tools from overlaying itself
        setTimeout(() => {
          window.focus();
        }, 500);
      });
    }

    // Center the new window in the desired display
    const display = this.getDesiredDisplay();
    this.positionWindowOnDisplay(window, display);

    if (typeof options.path === 'string' && process.platform === 'darwin') {
      window.setRepresentedFilename(options.path);
    }

    window.loadURL(
      url.format({
        pathname: getRendererHtmlPath(),
        protocol: 'file:',
        query: {
          windowType,
          options: JSON.stringify(options),
        },
        slashes: true,
      }),
    );

    window.on('page-title-updated', event => {
      // Prevents windows from updating their title
      event.preventDefault();
    });

    // Open all links in the external browser
    window.webContents.on('new-window', (event, openedUrl: string) => {
      if (openedUrl.indexOf('http') === 0) {
        event.preventDefault();
        shell.openExternal(openedUrl);
      }
    });

    window.on('closed', () => {
      const index = this.windows.indexOf(window);
      if (index > -1) {
        this.windows.splice(index, 1);
      }
    });

    this.windows.push(window);

    return window;
  }

  public closeAllWindows() {
    this.windows.forEach(window => {
      window.close();
    });
  }

  private getDesiredDisplay(): Electron.Display {
    const desiredDisplayString = process.env.DISPLAY;
    if (typeof desiredDisplayString === 'string') {
      const desiredDisplayIndex = parseInt(desiredDisplayString, 10);
      if (Number.isInteger(desiredDisplayIndex)) {
        const displays = screen.getAllDisplays();
        const display = displays[desiredDisplayIndex];
        if (display) {
          return display;
        }
      }
    }
    // If we cannot find a display from the environment variable, return the primary
    return screen.getPrimaryDisplay();
  }

  private positionWindowOnDisplay(
    window: Electron.BrowserWindow,
    display: Electron.Display,
  ) {
    const [width, height] = window.getSize();
    const x = Math.floor(
      display.workArea.x + display.workArea.width / 2 - width / 2,
    );
    const y = Math.floor(
      display.workArea.y + display.workArea.height / 2 - height / 2,
    );
    window.setPosition(x, y);
  }
}
