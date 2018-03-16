import { Transport } from './Transport';

export class DummyTransport extends Transport {
  constructor() {
    super();
  }

  public sendRequest() {
    throw new Error('Calling sendRequest before the changing the transport');
  }

  public sendResponse() {
    throw new Error('Calling sendResponse before the changing the transport');
  }
}
