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
import { app, BrowserWindow, screen, shell } from 'electron';
import path from 'path';
import url from 'url';

import { store } from '../store';
import {
  getSingletonKey,
  getWindowOptions,
  IWindowConstructorOptions,
} from '../windows/Window';
import { WindowOptions, WindowType } from '../windows/WindowOptions';

export interface IEventListenerCallbacks {
  blur?: () => void;
  focus?: () => void;
  closed?: () => void;
}

interface IWindowHandle {
  window: Electron.BrowserWindow;
  type: string;
  singletonKey: string | undefined;
}

const isDevelopment = process.env.NODE_ENV === 'development';

function getRendererHtmlPath() {
  const indexModule = isDevelopment
    ? require('../../static/index.development.html')
    : require('../../static/index.html');
  // __dirname is the directory of the bundle
  return path.resolve(__dirname, indexModule.default);
}

interface ICreatedWindow<W extends BrowserWindow> {
  // The existing or newly created window object
  window: W;
  // If true a window of the same type and singleton key already existed
  existing: boolean;
}

const OUTDATED_PREFIX = '[Outdated] ';

export class WindowManager {
  public windows: IWindowHandle[] = [];

  private pendingUpdate = false;

  /**
   * Either creates a new or returns an existing window depending on the implementation of the getSingletonKey function
   * defined by the window type and the props provided as argument.
   */
  public createWindow<W extends BrowserWindow>(
    options: WindowOptions,
  ): ICreatedWindow<W> {
    // Generate a singleton key
    const singletonKey = getSingletonKey(options);
    // Find a window of the same type and unique id
    const existing = this.windows.find(
      w => w.type === options.type && w.singletonKey === singletonKey,
    );
    // Return the window if another window of the same type and singleton key exists
    if (existing) {
      return { window: existing.window as W, existing: true };
    }

    // Get the window options that are default for this type of window
    const defaultWindowOptions = getWindowOptions(options);
    // Get the window options that are saved for this type of window
    const savedWindowOptions = this.getWindowOptions(options.type);
    // If the window is not resizeable, ignore the width and height of the saved window options
    if (defaultWindowOptions.resizable === false) {
      delete savedWindowOptions.width;
      delete savedWindowOptions.height;
    }
    // Ensure the saved window options don't get out of control
    // @see https://github.com/realm/realm-studio/issues/962
    savedWindowOptions.height = Math.max(
      defaultWindowOptions.height || 600,
      savedWindowOptions.height || 0,
    );
    // Combine these with general default options
    const combinedWindowOptions: IWindowConstructorOptions = {
      // Starting with the default options
      title: app.name,
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
      ...defaultWindowOptions,
      ...savedWindowOptions,
      webPreferences: {
        nodeIntegration: true,
        // Load Sentry as a preload in production - this doesn't work in development because the
        // sentry.js is not emitted to the build folder.
        preload: isDevelopment
          ? undefined
          : path.resolve(__dirname, './sentry.bundle.js'),
      },
    };

    // Prefix the title of the window, if an update is pending
    if (this.pendingUpdate) {
      combinedWindowOptions.title =
        OUTDATED_PREFIX + combinedWindowOptions.title;
    }

    // Spread out the options that Studio extends Electron with
    const { maximize, ...windowOptions } = combinedWindowOptions;

    // Leave a breadcrumb for Sentry
    sentry.addBreadcrumb({
      category: 'ui.window',
      message: `Opening '${options.type}' window`,
      data: {
        title: windowOptions.title,
      },
    });

    // Construct the window
    const window = new BrowserWindow(windowOptions) as W;
    this.windows.push({
      window,
      type: options.type,
      singletonKey,
    });

    // If the window should maximize - let's maximize it when it gets shown
    if (maximize) {
      window.once('show', () => {
        window.maximize();
      });
    }

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
    if (display) {
      this.positionWindowOnDisplay(window, display);
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

    // When the window is about to close, save its size, position and maximized state for the next of its type
    window.once('close', () => {
      const [width, height] = window.getSize();
      const [x, y] = window.getPosition();
      const isMaximized = window.isMaximized();
      const fullscreen = window.isFullScreen();
      this.setWindowOptions(options.type, {
        width,
        height,
        x,
        y,
        maximize: isMaximized,
        fullscreen,
      });
    });

    window.once('closed', () => {
      const index = this.windows.findIndex(handle => handle.window === window);
      if (index > -1) {
        // Remove the window
        this.windows.splice(index, 1);
      }
      // Loaded
      sentry.addBreadcrumb({
        category: 'ui.window',
        message: `Closed '${options.type}' window`,
      });
    });

    return { window, existing: false };
  }

  public async closeAllWindows(): Promise<void> {
    await Promise.all(
      // Creates a new array using the mapping as closing the windows will remove them from the
      // this.windows collection
      this.windows
        .map(handle => handle.window)
        .map(window => {
          return new Promise<void>(resolve => {
            window.once('closed', resolve);
            window.close();
          });
        }),
    );
  }

  public setPendingUpdate(pendingUpdate: boolean) {
    this.pendingUpdate = pendingUpdate;
    // Update title of all windows
    for (const w of this.windows) {
      const { window } = w;
      const title = window.getTitle();
      if (this.pendingUpdate && !title.startsWith(OUTDATED_PREFIX)) {
        window.setTitle(OUTDATED_PREFIX + title);
      } else if (!this.pendingUpdate) {
        window.setTitle(title.replace(OUTDATED_PREFIX, ''));
      }
    }
  }

  /**
   * Gets the window options from the Electron store
   */
  private getWindowOptions(type: WindowType) {
    return store.getWindowOptions(type);
  }

  /**
   * Saves options that should be passed to windows of this type when created in the future.
   * Use this to remember the position or other state of the windows between instances.
   */
  private setWindowOptions(
    type: WindowType,
    options: IWindowConstructorOptions,
  ) {
    store.setWindowOptions(type, options);
  }

  private getDesiredDisplay() {
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
