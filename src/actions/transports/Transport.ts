import { EventEmitter } from 'events';

export abstract class Transport extends EventEmitter {
  public static REQUEST_EVENT_NAME = 'action-request';
  public static RESPONSE_EVENT_NAME = 'action-response';

  public abstract sendRequest(
    requestId: string,
    action: string,
    ...args: any[]
  ): void;

  public abstract sendResponse(
    requestId: string,
    result: any,
    success: boolean,
  ): void;
}
