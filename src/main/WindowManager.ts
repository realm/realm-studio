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

import * as sentry from '@sentry/electron';
import { BrowserWindow, screen, shell } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as url from 'url';

import {
  getRendererProcessDirectories,
  getRendererProcessDirectory,
} from '../utils';
import { getWindowOptions } from '../windows/Window';
import { WindowOptions } from '../windows/WindowOptions';

export interface IEventListenerCallbacks {
  blur?: () => void;
  focus?: () => void;
  closed?: () => void;
}

interface IWindowHandle {
  window: Electron.BrowserWindow;
  pid: number;
  processDir: string;
}

const isDevelopment = process.env.NODE_ENV === 'development';

function getRendererHtmlPath() {
  const indexPath = isDevelopment
    ? require('../../static/index.development.html')
    : require('../../static/index.html');
  // __dirname is the directory of the bundle
  return path.resolve(__dirname, indexPath);
}

export class WindowManager {
  public windows: IWindowHandle[] = [];

  public createWindow(options: WindowOptions) {
    const windowOptions = getWindowOptions(options);
    sentry.addBreadcrumb({
      category: 'ui.window',
      message: `Opening '${options.type}' window`,
      data: {
        title: windowOptions.title,
      },
    });
    // Construct the window
    const window = new BrowserWindow({
      // Starting with the default options
      title: 'Realm Studio',
      width: 800,
      height: 600,
      vibrancy: 'light',
      show: false,
      // This should be the same as the value of the SCSS variable $body-bg
      backgroundColor: '#f5f5f9',
      // Accepting the first mouse event, so users dont have to focus windows before clicking them.
      // This improves the UX by minimizing the clicks needed to complete a task.
      acceptFirstMouse: true,
      // Allowing windows to override the defaults
      ...windowOptions,
      webPreferences: {
        // Load Sentry as a preload in production - this doesn't work in development because the
        // sentry.js is not emitted to the build folder.
        preload: isDevelopment
          ? undefined
          : path.resolve(__dirname, './sentry.bundle.js'),
      },
    });

    // Open up the dev tools, if not in production mode
    if (process.env.REALM_STUDIO_DEV_TOOLS) {
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

    if (
      process.platform === 'darwin' &&
      options.type === 'realm-browser' &&
      options.props.realm.mode === 'local'
    ) {
      window.setRepresentedFilename(options.props.realm.path);
    }

    const query: { [key: string]: string } = {
      options: JSON.stringify(options),
    };

    // @see https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline
    if (isDevelopment && process.env.REACT_PERF) {
      query.react_perf = 'enabled';
    }

    // Load the renderer html into the window
    window.loadURL(
      url.format({
        pathname: getRendererHtmlPath(),
        protocol: 'file:',
        query,
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

    window.webContents.once('did-finish-load', () => {
      const pid = window.webContents.getOSProcessId();
      // The current working directory should be changed from within the renderer process
      const processDir = getRendererProcessDirectory(pid);
      this.windows.push({
        window,
        pid,
        processDir,
      });
    });

    window.on('closed', () => {
      const index = this.windows.findIndex(handle => handle.window === window);
      if (index > -1) {
        // Only read out the processDir if the window is still present
        const { processDir } = this.windows[index];
        // Wait a second for Windows to unlock the directory before deleting it
        setTimeout(() => {
          this.cleanupRendererProcessDirectory(processDir);
        }, 1000);
        // Remove the window
        this.windows.splice(index, 1);
      }
      // Loaded
      sentry.addBreadcrumb({
        category: 'ui.window',
        message: `Closed '${options.type}' window`,
      });
    });

    return window;
  }

  public closeAllWindows() {
    this.windows.forEach(({ window }) => {
      window.close();
    });
  }

  /** This will clean up any existing renderer directories */
  public cleanupRendererProcessDirectories() {
    const rendererPaths = getRendererProcessDirectories();
    for (const rendererPath of rendererPaths) {
      // Deleting these folders are not obvious side-effects, so let's log that
      // tslint:disable-next-line:no-console
      console.log(`Removing abandoned renderer directory ${rendererPath}`);
      fs.removeSync(rendererPath);
    }
  }

  private cleanupRendererProcessDirectory(rendererPath: string) {
    try {
      fs.removeSync(rendererPath);
    } catch (err) {
      // Deleting these folders are not obvious side-effects, so let's log if it fails
      // tslint:disable-next-line:no-console
      console.error(
        `Failed while cleaning up renderer directory ${rendererPath}`,
        err,
      );
    }
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
