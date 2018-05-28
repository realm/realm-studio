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
