import { Transport } from './Transport';

export class DebugTransport extends Transport {
  public static instance: DebugTransport;
  public static getInstance() {
    if (!DebugTransport.instance) {
      DebugTransport.instance = new DebugTransport();
    }
    return DebugTransport.instance;
  }

  public sendRequest(requestId: string, action: string, ...args: any[]) {
    DebugTransport.instance.emit(
      Transport.REQUEST_EVENT_NAME,
      requestId,
      action,
      ...args,
    );
  }

  public sendResponse(requestId: string, result: any) {
    DebugTransport.instance.emit(
      Transport.RESPONSE_EVENT_NAME,
      requestId,
      result,
    );
  }
}
