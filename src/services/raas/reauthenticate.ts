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

import { main } from '../../actions/main';
import * as user from './user';

let promise: Promise<void> | null;

/**
 * Asks the user to authenticate again
 * @return A promise of a reauthenticated user
 */
export const reauthenticate = (message: string) => {
  // Check if we are already trying to reauthenticate the user
  if (!promise) {
    promise = main.showCloudAuthentication({ message }, true).then(() => {
      promise = null;
    });
  }
  return promise;
};
