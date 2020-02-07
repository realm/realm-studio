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

type ErrorFactory = () => Error | Promise<Error>;

export const timeout = <Result>(
  ms: number,
  err: Error | ErrorFactory,
  wrappedPromise: Promise<Result>,
): Promise<Result> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      Promise.resolve(typeof err === 'function' ? err() : err).then(reject);
    }, ms);
    // Resolve or reject this promise from the wrappedPromise
    wrappedPromise.then(
      result => {
        clearTimeout(timer);
        resolve(result);
      },
      wrappedError => {
        clearTimeout(timer);
        reject(wrappedError);
      },
    );
  });
};
