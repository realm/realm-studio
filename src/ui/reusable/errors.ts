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

import * as sentry from '@sentry/electron';

import * as electron from 'electron';

export const showError = (
  failedIntent: string,
  error?: any,
  messageOverrides: { [msg: string]: string } = {},
) => {
  // tslint:disable-next-line:no-console
  console.error(error);
  let message: string = '';
  if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object') {
    message = error.title || error.message || message;
  }
  if (message in messageOverrides) {
    message = messageOverrides[message];
  }
  const messageOptions = {
    type: 'error',
    // Prepend the intent
    message: message.length > 0 ? `${failedIntent}:\n${message}` : failedIntent,
    title: failedIntent,
  };
  // Tell Sentry about this error
  sentry.captureEvent({
    level: sentry.Severity.Debug,
    // We don't want the message to wrap to the next line when reporting this to Sentry
    message: message.length > 0 ? `${failedIntent}: ${message}` : failedIntent,
    tags: { type: 'user-error' },
  });
  // Show a message box ...
  if (process.type === 'renderer') {
    electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      messageOptions,
    );
  } else {
    electron.dialog.showMessageBox(messageOptions);
  }
};
