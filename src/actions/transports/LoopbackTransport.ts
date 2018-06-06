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

import { Transport } from './Transport';

export class LoopbackTransport extends Transport {
  public static instance: LoopbackTransport;
  public static getInstance() {
    if (!LoopbackTransport.instance) {
      LoopbackTransport.instance = new LoopbackTransport();
    }
    return LoopbackTransport.instance;
  }

  constructor() {
    super();
    if (LoopbackTransport.instance) {
      throw new Error(`Don't call constructor: Use the static #getInstance()`);
    }
  }

  public sendRequest(requestId: string, action: string, ...args: any[]) {
    LoopbackTransport.getInstance().emit(
      Transport.REQUEST_EVENT_NAME,
      requestId,
      action,
      ...args,
    );
  }

  public sendResponse(requestId: string, result: any, success: boolean) {
    LoopbackTransport.getInstance().emit(
      Transport.RESPONSE_EVENT_NAME,
      requestId,
      result,
      success,
    );
  }
}
