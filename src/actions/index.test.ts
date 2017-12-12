import * as assert from 'assert';

import { ActionReceiver } from './ActionReceiver';
import { ActionSender } from './ActionSender';
import { LoopbackTransport } from './transports';

enum Actions {
  TestAction = 'test-action',
  FailAction = 'fail-action',
}

describe('Actions', () => {
  describe('ActionSender ➜ ActionReceiver ➜ ActionSender', () => {
    interface IEchoMessage {
      echo: string;
    }

    // tslint:disable:max-classes-per-file

    class TestSender extends ActionSender {
      public test(echo: string): Promise<string> {
        const message: IEchoMessage = { echo };
        return this.send(Actions.TestAction, message);
      }

      public fail(reason: string): Promise<void> {
        return this.send(Actions.FailAction, reason);
      }
    }

    class TestReceiver extends ActionReceiver {
      constructor() {
        super({
          [Actions.TestAction]: (message: IEchoMessage) => {
            return new Promise(resolve => {
              setTimeout(() => {
                // Wait for it ...
                resolve(`${message.echo} World!`);
              }, 10);
            });
          },
          [Actions.FailAction]: (reason: string) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const err = new Error(reason);
                reject(err);
              }, 10);
            });
          },
        });
      }
    }

    let sender: TestSender;
    let receiver: TestReceiver;

    beforeEach(() => {
      sender = new TestSender();
      receiver = new TestReceiver();

      const loopbackTransport = LoopbackTransport.getInstance();
      sender.setTransport(loopbackTransport);
      receiver.setTransport(loopbackTransport);
    });

    afterEach(() => {
      sender.destroy();
      receiver.destroy();
    });

    it('can send a message and receive the result', async () => {
      const response = await sender.test('Hello');
      assert.equal(response, 'Hello World!');
    });

    it('rejects if an error happens', async () => {
      let threw = false;
      try {
        await sender.fail('Reason for failure');
      } catch (err) {
        assert(err instanceof Error);
        assert.equal(err.message, 'Reason for failure');
        threw = true;
      } finally {
        assert(threw, 'Expected a rejected promise');
      }
    });
  });
});
