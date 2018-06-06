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

import * as assert from 'assert';

import { ActionReceiver } from './ActionReceiver';
import { ActionSender } from './ActionSender';
import { LoopbackTransport, Transport } from './transports';

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
      constructor(transport: Transport) {
        super(
          {
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
          },
          transport,
        );
      }
    }

    let sender: TestSender;
    let receiver: TestReceiver;

    beforeEach(() => {
      const loopbackTransport = LoopbackTransport.getInstance();
      sender = new TestSender(loopbackTransport);
      receiver = new TestReceiver(loopbackTransport);
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
