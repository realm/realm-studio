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

import assert from 'assert';

import { createPromiseHandle } from './promise-handle';

describe('promise handle', () => {
  it('can create a handle', () => {
    const handle = createPromiseHandle();
    assert.equal(typeof handle.resolve, 'function');
    assert.equal(typeof handle.reject, 'function');
    assert.equal(typeof handle.promise, 'object');
    assert(handle.promise instanceof Promise);
  });

  it('can resolve the promise', done => {
    const handle = createPromiseHandle();
    handle.promise.then(result => {
      assert.equal(result, 'w00t');
      done();
    });
    process.nextTick(() => {
      handle.resolve('w00t');
    });
  });

  it('can reject the promise', done => {
    const handle = createPromiseHandle();
    handle.promise.catch(result => {
      assert.equal(result, 'w00t');
      done();
    });
    process.nextTick(() => {
      handle.reject('w00t');
    });
  });
});
