import { v4 as uuid } from 'uuid';

import { IActionHandlers } from '.';
import { DummyTransport, Transport } from './transports';

interface IRequestHandle {
  promise: Promise<any>;
  resolve: (args: any[]) => void;
  reject: (error: Error) => void;
  error: Error;
}

export abstract class ActionSender {
  protected transport: Transport;
  private requests: {
    [id: string]: IRequestHandle;
  } = {};

  constructor(transport: Transport = new DummyTransport()) {
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

  protected addTransportListener() {
    if (this.transport) {
      this.transport.on(Transport.RESPONSE_EVENT_NAME, this.onResponse);
    }
  }

  protected removeTransportListener() {
    if (this.transport) {
      this.transport.removeListener(
        Transport.RESPONSE_EVENT_NAME,
        this.onResponse,
      );
    }
  }

  protected awaitResponse(requestId: string): Promise<any> {
    // Creating a placeholder, with values that should get overwritten before this method returns
    const requestHandle: Partial<IRequestHandle> = {
      // Creating the error here to provide a better stacktrace
      error: new Error(),
    };
    // Create the promise and override the handles .resolve
    requestHandle.promise = new Promise((resolve, reject) => {
      requestHandle.resolve = resolve;
      requestHandle.reject = reject;
    });
    // Hold on to and return the request handle
    if (requestHandle.promise && requestHandle.resolve) {
      this.requests[requestId] = requestHandle as IRequestHandle;
      return this.requests[requestId].promise;
    } else {
      throw new Error(`The promise or resolve callback was not set`);
    }
  }

  private onResponse = (requestId: string, result: any, success: boolean) => {
    if (requestId in this.requests) {
      const request = this.requests[requestId];
      if (success) {
        // Resolve with the result from the receiver
        request.resolve(result);
      } else {
        // Override the error message and reject the promise
        request.error.message = result as string;
        request.reject(request.error);
      }
      delete this.requests[requestId];
    }
  };
}
