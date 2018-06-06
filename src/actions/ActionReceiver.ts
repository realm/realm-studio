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

import { IActionHandlers } from '.';
import { Transport } from './transports';

export abstract class ActionReceiver {
  private transport: Transport;
  private handlers: IActionHandlers;

  constructor(handlers: IActionHandlers, transport: Transport) {
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
