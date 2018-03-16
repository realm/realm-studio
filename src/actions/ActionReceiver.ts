import { IActionHandlers } from '.';
import { DummyTransport, Transport } from './transports';

export abstract class ActionReceiver {
  private transport: Transport;
  private handlers: IActionHandlers;

  constructor(
    handlers: IActionHandlers,
    transport: Transport = new DummyTransport(),
  ) {
    this.handlers = handlers;
    this.transport = transport;
    this.addTransportListener();
  }

  public destroy() {
    this.removeTransportListener();
  }

  public setTransport(transport: Transport) {
    this.removeTransportListener();
    this.transport = transport;
    this.addTransportListener();
  }

  public getTransport() {
    return this.transport;
  }

  protected addTransportListener() {
    if (this.transport) {
      this.transport.on(Transport.REQUEST_EVENT_NAME, this.onRequest);
    }
  }

  protected removeTransportListener() {
    if (this.transport) {
      this.transport.removeListener(
        Transport.REQUEST_EVENT_NAME,
        this.onRequest,
      );
    }
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
