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

import { BrowserWindow, screen, shell } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as url from 'url';

import {
  getRendererProcessDirectories,
  getRendererProcessDirectory,
} from '../utils';
import { getWindowOptions } from '../windows/Window';
import { WindowTypedProps } from '../windows/WindowTypedProps';

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

const isProduction = process.env.NODE_ENV === 'production';

function getRendererHtmlPath() {
  const indexPath = isProduction
    ? require('../../static/index.html')
    : require('../../static/index.development.html');
  // __dirname is the directory of the bundle
  return path.resolve(__dirname, indexPath);
}

export class WindowManager {
  public windows: IWindowHandle[] = [];

  public constructor() {
    // Call this to cleanup abandoned renderer process directories
    this.cleanupRendererProcessDirectories();
  }

  public createWindow(props: WindowTypedProps) {
    const window = new BrowserWindow({
      title: 'Realm Studio',
      width: 800,
      height: 600,
      vibrancy: 'light',
      show: false,
      ...getWindowOptions(props),
      webPreferences: {
        // Load Sentry as a preload in production - this doesn't work in development because the
        // sentry.js is not emitted to the build folder.
        preload: isProduction
          ? path.resolve(__dirname, './sentry.js')
          : undefined,
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
      props.type === 'realm-browser' &&
      props.realm.mode === 'local'
    ) {
      window.setRepresentedFilename(props.realm.path);
    }

    const query: { [key: string]: string } = {
      props: JSON.stringify(props),
    };

    // @see https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline
    if (!isProduction && process.env.REACT_PERF) {
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
      const { processDir } = this.windows[index];
      if (index > -1) {
        this.windows.splice(index, 1);
      }
      // Wait a second for Windows to unlock the directory
      setTimeout(() => {
        this.cleanupRendererProcessDirectory(processDir);
      }, 1000);
    });

    return window;
  }

  public closeAllWindows() {
    this.windows.forEach(({ window }) => {
      window.close();
    });
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

  /** This will clean up any existing renderer directories */
  private cleanupRendererProcessDirectories() {
    const rendererPaths = getRendererProcessDirectories();
    for (const rendererPath of rendererPaths) {
      // Deleting these folders are not obvious side-effects, so let's log that
      // tslint:disable-next-line:no-console
      console.log(`Removing abandoned renderer directory ${rendererPath}`);
      fs.removeSync(rendererPath);
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
