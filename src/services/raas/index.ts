import { store } from '../../store';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../github';

export const ENDPOINT_STORAGE_KEY = 'cloud.endpoint';
export const TOKEN_STORAGE_KEY = 'cloud.token';

import { reauthenticate } from './reauthenticate';
import * as user from './user';
export { user };

export enum Endpoint {
  Production = 'https://cloud.realm.io',
  Staging = 'https://raas2.realmlab.net',
}

// {"id":"ie1","controllerUrl":"https://ie1.raas.realmlab.net","region":"ireland","label":"Ireland Dev 1"}
export interface ILocation {
  id: string;
  controllerUrl: string;
  region: string;
  label: string;
}

export const getEndpoint = (): Endpoint => {
  return store.get(ENDPOINT_STORAGE_KEY, Endpoint.Production);
};

export const buildUrl = (service: string, version: string, path: string) => {
  const endpoint = getEndpoint();
  return `${endpoint}/api/${service}/${version}/${path}`;
};

export const fetchAuthenticated = async (
  url: string,
  options: RequestInit,
): Promise<Response> => {
  const token = store.get(TOKEN_STORAGE_KEY);
  if (!token) {
    throw new Error('Missing the Cloud token - please authenticate first');
  }
  // Append the "Authorization" header or initialize
  if (options.headers instanceof Headers) {
    options.headers.set('Authorization', `Bearer ${token}`);
  } else {
    options.headers = new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  const response = await fetch(url, options);
  if (response.status === 401) {
    // We assumed an authenticated user - but request failed with "Unauthorized" status.
    // Logout the user if they are logged in
    if (user.hasToken()) {
      user.forgetToken();
    }
    // Make the user authenticate again
    await reauthenticate('Authentication failed, you need to login again');
    // Retry the request
    return fetchAuthenticated(url, options);
  }
  return response;
};

export const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    return (await response.json()).message;
  } catch (err) {
    try {
      const message = await response.text();
      return message || 'Error from Realm Cloud';
    } catch (err) {
      return `Error from Realm Cloud (status = ${response.status})`;
    }
  }
};

export const setEndpoint = (endpoint: Endpoint) => {
  if (endpoint === null) {
    store.delete(ENDPOINT_STORAGE_KEY);
  } else {
    store.set(ENDPOINT_STORAGE_KEY, endpoint);
  }
};
