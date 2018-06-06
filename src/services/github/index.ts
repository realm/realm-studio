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

import * as electron from 'electron';
import { URL } from 'url';
import { v4 as uuid } from 'uuid';

import { STUDIO_PROTOCOL } from '../../constants';

interface IAuthenticationHandler {
  resolve: (code: string) => void;
  reject: (err: Error) => void;
  url: URL;
}

const authenticationPromises: { [state: string]: IAuthenticationHandler } = {};

export const OPEN_URL_ACTION = 'github-oauth';
export const GITHUB_CLIENT_ID = '9e947af0f244f295235c';
export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_REDIRECT_URI = `${STUDIO_PROTOCOL}://${OPEN_URL_ACTION}`;

export interface IOAuthCallbackOptions {
  code: string;
  state: string;
}

export const authenticate = (
  scope: string = 'read:org read:user user:email',
  onState?: (state: string) => void,
) => {
  // Throw an error if accessed from the renderer
  if (process.type !== 'browser') {
    throw new Error('This API is supposed to be called from the main process.');
  }
  return new Promise<string>((resolve, reject) => {
    // Create a temporary uuid that will transfered back to the callback when authenticated
    const state = uuid();

    const url = new URL(GITHUB_AUTHORIZE_URL);
    url.searchParams.set('client_id', GITHUB_CLIENT_ID);
    url.searchParams.set('redirect_uri', GITHUB_REDIRECT_URI);
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);

    // Save the promise resolve function - so the callback can call it
    authenticationPromises[state] = { resolve, reject, url };

    // Open the GitHub URL using the users external browser
    openUrl(state);
    // Call the callback as the state is now known
    if (onState) {
      onState(state);
    }
  });
};

export const openUrl = (state: string) => {
  if (state in authenticationPromises) {
    const { url } = authenticationPromises[state];
    electron.shell.openExternal(url.toString());
  } else {
    throw new Error(`Unexpected state ${state}`);
  }
};

export const handleOauthCallback = (options: IOAuthCallbackOptions) => {
  // Throw an error if accessed from the renderer
  if (process.type !== 'browser') {
    throw new Error('This API is supposed to be called from the main process.');
  }
  if (options.state in authenticationPromises) {
    // If the callback was expected - resolve the appropriate promise
    const promise = authenticationPromises[options.state];
    promise.resolve(options.code);
  } else {
    // Read out the code from the url.searchParams
    electron.dialog.showMessageBox({
      type: 'info',
      message:
        'Was asked to handle GitHub authentication, state was unexpected:\n' +
        JSON.stringify(options),
    });
  }
};

export const abortPendingAuthentications = () => {
  const err = new Error('Pending GitHub authentications were aborted');
  Object.entries(authenticationPromises).forEach(([state, { reject }]) => {
    // Forget about the promise and reject it
    delete authenticationPromises[state];
    reject(err);
  });
};
