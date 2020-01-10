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

import { ipcRenderer } from 'electron';

import { Transport } from './Transport';

export class RendererTransport extends Transport {
  public static instance: RendererTransport;
  public static getInstance() {
    if (!RendererTransport.instance) {
      RendererTransport.instance = new RendererTransport();
    }
    return RendererTransport.instance;
  }

  public constructor() {
    super();
    if (process.type !== 'renderer') {
      throw new Error('Can only use the RendererTransport in a renderer');
    }
    ipcRenderer.on(Transport.RESPONSE_EVENT_NAME, this.onResponseMessage);
    ipcRenderer.on(Transport.REQUEST_EVENT_NAME, this.onRequestMessage);
  }

  public sendRequest(requestId: string, action: string, ...args: any[]) {
    ipcRenderer.send(Transport.REQUEST_EVENT_NAME, requestId, action, ...args);
  }

  public sendResponse(requestId: string, result: any, success: boolean) {
    ipcRenderer.send(Transport.RESPONSE_EVENT_NAME, requestId, result, success);
  }

  private onResponseMessage = (
    event: Electron.IpcRendererEvent,
    ...args: any[]
  ) => {
    this.emit(Transport.RESPONSE_EVENT_NAME, ...args);
  };

  private onRequestMessage = (
    event: Electron.IpcRendererEvent,
    ...args: any[]
  ) => {
    this.emit(Transport.REQUEST_EVENT_NAME, ...args);
  };
}
