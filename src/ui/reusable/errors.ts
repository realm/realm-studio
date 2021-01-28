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

import electron from 'electron';

export const showError = (
  failedIntent: string,
  error?: any,
  messageOverrides: { [msg: string]: string } = {},
) => {
  console.error(error);
  let message = '';
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
    message: failedIntent,
    detail: message,
    title: failedIntent,
  };
  // Tell Sentry about this error
  sentry.captureEvent({
    level: sentry.Severity.Debug,
    // Using the failedIntent as message to get more similar messages
    message: failedIntent,
    tags: { type: 'user-error' },
    // Sending along the message as extra context
    extra: { message },
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
