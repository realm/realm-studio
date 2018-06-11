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

// This utility can be used to create a promise and externalize the resolve and reject methods to the caller

export interface IPromiseHandle<T> {
  promise: Promise<T>;
  resolve: (result: T) => void;
  reject: (reason: any) => void;
}

export const createPromiseHandle = <T extends any>() => {
  const handle: Partial<IPromiseHandle<T>> = {};
  handle.promise = new Promise<T>((resolve, reject) => {
    handle.resolve = resolve;
    handle.reject = reject;
  });
  return handle as IPromiseHandle<T>;
};
