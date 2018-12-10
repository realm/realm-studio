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

import { ipcMain } from 'electron';

import { Transport } from './Transport';

export class MainTransport extends Transport {
  private webContents: Electron.WebContents;

  public constructor(webContents: Electron.WebContents) {
    super();
    if (process.type !== 'browser') {
      throw new Error('Can only use the MainTransport in the main process');
    }
    this.webContents = webContents;
    ipcMain.on(Transport.REQUEST_EVENT_NAME, this.onRequestMessage);
    ipcMain.on(Transport.RESPONSE_EVENT_NAME, this.onResponseMessage);
  }

  public sendRequest(requestId: string, action: string, ...args: any[]) {
    this.webContents.send(
      Transport.REQUEST_EVENT_NAME,
      requestId,
      action,
      ...args,
    );
  }

  public sendResponse(requestId: string, result: any, success: boolean) {
    if (this.webContents.isDestroyed()) {
      // tslint:disable-next-line:no-console
      console.info(`Skipped responding to a distroyed window (${requestId})`);
    } else {
      this.webContents.send(
        Transport.RESPONSE_EVENT_NAME,
        requestId,
        result,
        success,
      );
    }
  }

  private onRequestMessage = (
    event: Electron.IpcMessageEvent,
    ...args: any[]
  ) => {
    // Make this transport emit whenever the ipcMain receives something from this webContent.
    if (event.sender === this.webContents) {
      this.emit(Transport.REQUEST_EVENT_NAME, ...args);
    }
  };

  private onResponseMessage = (
    event: Electron.IpcMessageEvent,
    ...args: any[]
  ) => {
    // Make this transport emit whenever the ipcMain receives something from this webContent.
    if (event.sender === this.webContents) {
      this.emit(Transport.RESPONSE_EVENT_NAME, ...args);
    }
  };
}
