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

  protected awaitResponse(requestId: string): Promise<any> {
    // Creating a placeholder, with values that should get overwritten before this method returns
    const requestHandle: Partial<IRequestHandle> = {};
    // Create the promise and override the handles .resolve
    requestHandle.promise = new Promise((resolve, reject) => {
      requestHandle.resolve = resolve;
    });
    // Hold on to and return the request handle
    if (requestHandle.promise && requestHandle.resolve) {
      this.requests[requestId] = requestHandle as IRequestHandle;
      return this.requests[requestId].promise;
    } else {
      throw new Error(`The promise or resolve callback was not set`);
    }
  }

  private onResponse = (requestId: string, result: any) => {
    if (requestId in this.requests) {
      const request = this.requests[requestId];
      request.resolve(result);
      delete this.requests[requestId];
    }
  };
}
