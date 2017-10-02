import * as assert from 'assert';

import { ActionReceiver } from './ActionReceiver';
import { ActionSender } from './ActionSender';

enum Actions {
  TestAction = 'test-action',
}

describe('Actions', () => {
  describe('ActionSender ➜ ActionReceiver ➜ ActionSender', () => {
    interface IEchoMessage {
      echo: string;
    }

    class TestSender extends ActionSender {
      public async test(echo: string) {
        const message: IEchoMessage = { echo };
        return this.send(Actions.TestAction, message);
      }
    }
    const sender = new TestSender();

    const receiver = new ActionReceiver({
      [Actions.TestAction]: async (message: IEchoMessage) => {
        return new Promise(resolve => {
          setTimeout(() => {
            // Wait for it ...
            resolve(`${message.echo} World!`);
          }, 10);
        });
      },
    });

    it('can send a message and receive the result', async () => {
      const response = await sender.test('Hello');
      assert.equal(response, 'Hello World!');
    });
  });
});
