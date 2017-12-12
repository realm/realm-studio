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
