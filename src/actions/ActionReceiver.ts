import { IActionHandlers } from '.';
import { Transport } from './transports';

export abstract class ActionReceiver {
  private transport: Transport;
  private handlers: IActionHandlers;

  constructor(handlers: IActionHandlers) {
    this.handlers = handlers;
  }

  public destroy() {
    if (this.transport) {
      this.transport.removeListener(
        Transport.REQUEST_EVENT_NAME,
        this.onRequest,
      );
    }
  }

  public setTransport(transport: Transport) {
    this.transport = transport;
    this.transport.on(Transport.REQUEST_EVENT_NAME, this.onRequest);
  }

  public getTransport() {
    return this.transport;
  }

  private onRequest = async (
    requestId: string,
    action: string,
    ...args: any[]
  ) => {
    if (action in this.handlers) {
      try {
        const result = await this.handlers[action](...args);
        this.transport.sendResponse(requestId, result, true);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(
          `Action "${action}" (${requestId}) failed: ${err.message}`,
        );
        this.transport.sendResponse(requestId, err.message, false);
      }
    } else {
      throw new Error(`ActionReceiver cannot handle "${action}" actions`);
    }
  };
}
