import { v4 as uuid } from 'uuid';

import { IActionHandlers } from '.';
import { getTransport, Transport } from './transports';

interface IRequestHandle {
  promise: Promise<any>;
  resolve: (args: any[]) => void;
}

export abstract class ActionSender {
  private transport: Transport;
  private requests: {
    [id: string]: IRequestHandle;
  } = {};

  constructor() {
    const transport = getTransport();
    if (transport) {
      this.setTransport(transport);
    }
  }

  public destroy() {
    this.transport.removeListener(
      Transport.RESPONSE_EVENT_NAME,
      this.onResponse,
    );
  }

  public setTransport(transport: Transport) {
    this.transport = transport;
    this.transport.on(Transport.RESPONSE_EVENT_NAME, this.onResponse);
  }

  public async send(action: string, ...args: any[]) {
    const requestId = uuid();
    if (this.transport) {
      this.transport.sendRequest(requestId, action, ...args);
      const result = await this.awaitResponse(requestId);
      return result;
    } else {
      throw new Error('ActionSender is missing a transport');
    }
  }

  protected awaitResponse(requestId: string) {
    const promise = new Promise((resolve, reject) => {
      this.requests[requestId] = {
        promise,
        resolve,
      };
    });
    return promise;
  }

  private onResponse = (requestId: string, result: any) => {
    if (requestId in this.requests) {
      const request = this.requests[requestId];
      request.resolve(result);
      delete this.requests[requestId];
    }
  };
}
