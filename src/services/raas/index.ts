import { store } from '../../store';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../github';

export const TOKEN_STORAGE_KEY = 'cloud.token';

import * as user from './user';
export { user };

// {"id":"ie1","controllerUrl":"https://ie1.raas.realmlab.net","region":"ireland","label":"Ireland Dev 1"}
export interface ILocation {
  id: string;
  controllerUrl: string;
  region: string;
  label: string;
}

export const buildUrl = (service: string, version: string, path: string) => {
  return `https://cloud.realm.io/api/${service}/${version}/${path}`;
};

export const fetchAuthenticated = (url: string, options: RequestInit) => {
  const token = store.get(TOKEN_STORAGE_KEY);
  if (!token) {
    throw new Error('Missing the Cloud token - please authenticate first');
  }
  const headers = new Headers({
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
  return fetch(url, {
    headers,
    ...options,
  });
};

export const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    return (await response.json()).message;
  } catch (err) {
    try {
      const message = await response.text();
      return `Error from RaaS: ${message}`;
    } catch (err) {
      return `Error without a message from RaaS (status = ${response.status})`;
    }
  }
};
