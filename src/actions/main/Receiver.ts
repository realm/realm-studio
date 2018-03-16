import * as electron from 'electron';

import {
  ActionReceiver,
  IActionHandlers,
  LoopbackTransport,
  MainTransport,
} from '..';

export class Receiver extends ActionReceiver {
  constructor(handlers: IActionHandlers, webContents?: electron.WebContents) {
    super(
      handlers,
      webContents
        ? new MainTransport(webContents)
        : LoopbackTransport.getInstance(),
    );
  }
}
