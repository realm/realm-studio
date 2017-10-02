import { ipcMain } from 'electron';

import { Transport } from './Transport';

export class MainTransport extends Transport {
  private webContents: Electron.WebContents;

  public constructor(webContents: Electron.WebContents) {
    super();
    this.webContents = webContents;
    ipcMain.on(Transport.REQUEST_EVENT_NAME, this.onRequestMessage);
  }

  public sendRequest(requestId: string, action: string, ...args: any[]) {
    this.webContents.send(
      Transport.RESPONSE_EVENT_NAME,
      requestId,
      action,
      ...args,
    );
  }

  public sendResponse(requestId: string, result: any) {
    this.webContents.send(Transport.RESPONSE_EVENT_NAME, requestId, result);
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
}
