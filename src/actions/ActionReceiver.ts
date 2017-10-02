import { IActionHandlers } from '.';
import { getTransport, Transport } from './transports';

export class ActionReceiver {
  private transport: Transport;
  private handlers: IActionHandlers;

  constructor(handlers: IActionHandlers) {
    this.handlers = handlers;
    const transport = getTransport();
    if (transport) {
      this.setTransport(transport);
    }
  }

  public destroy() {
    this.transport.removeListener(Transport.REQUEST_EVENT_NAME, this.onRequest);
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
        this.transport.sendResponse(requestId, result);
      } catch (err) {
        throw new Error(`Failed to perform "${action}": ${err.message}`);
      }
    } else {
      throw new Error(`ActionReceiver cannot handle "${action}" actions`);
    }
  };
}
