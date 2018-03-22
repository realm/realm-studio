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
    this.webContents.send(
      Transport.RESPONSE_EVENT_NAME,
      requestId,
      result,
      success,
    );
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
