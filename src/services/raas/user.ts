import {
  buildUrl,
  fetchAuthenticated,
  getErrorMessage,
  ILocation,
  TOKEN_STORAGE_KEY,
} from '.';
import { store } from '../../store';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../github';
import { IServerCredentials } from '../ros';

const buildUserUrl = (path: string) => buildUrl('user', 'v1beta', path);

export interface IRaasAuthenticationResponse {
  token: string;
}

export interface ICreateSubscriptionOptions {
  identifier: string;
  initialPassword?: string;
  locationId: string;
}

export interface IMeResponse {
  id: string;
  email: string;
  name: string;
  provider: string;
  password: boolean;
  displayName: string;
}

export interface ISubscription {
  id: string;
  tenantStatus: string;
  tenantUrl: string;
  plan: string;
  createdAt: string;
}

export const authenticate = async (
  githubCode: string,
): Promise<IRaasAuthenticationResponse> => {
  const url = buildUserUrl('auth/github');
  const response = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      code: githubCode,
      clientId: GITHUB_CLIENT_ID,
      redirectUri: GITHUB_REDIRECT_URI,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const hasToken = () => {
  return store.has(TOKEN_STORAGE_KEY);
};

export const getToken = (): string => {
  return store.get(TOKEN_STORAGE_KEY);
};

export const setToken = (token: string) => {
  store.set(TOKEN_STORAGE_KEY, token);
};

export const forgetToken = () => {
  store.delete(TOKEN_STORAGE_KEY);
};

export const getTenantCredentials = (url: string): IServerCredentials => {
  return {
    kind: 'other',
    url,
    options: {
      provider: 'jwt',
      data: getToken(),
    },
  };
};

export const getAuth = async () => {
  const url = buildUserUrl('auth');
  const response = await fetchAuthenticated(url, {
    method: 'GET',
  });
  if (response.ok) {
    return (await response.json()) as IMeResponse;
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const getLocations = async () => {
  const url = buildUserUrl('locations');
  const response = await fetchAuthenticated(url, {
    method: 'GET',
  });
  if (response.ok) {
    return (await response.json()) as ILocation[];
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const getSubscriptions = async () => {
  const url = buildUserUrl('subscriptions');
  const response = await fetchAuthenticated(url, {
    method: 'GET',
  });
  if (response.ok) {
    return (await response.json()) as ISubscription[];
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const deleteSubscriptionById = async (id: string) => {
  const url = buildUserUrl(`subscriptions/${id}`);
  const response = await fetchAuthenticated(url, {
    method: 'DELETE',
  });
  if (response.ok) {
    return true;
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const createSubscription = async (
  options: ICreateSubscriptionOptions,
) => {
  const url = buildUserUrl(`subscriptions`);
  const response = await fetchAuthenticated(url, {
    method: 'POST',
    body: JSON.stringify(options),
  });
  if (response.ok) {
    return (await response.json()) as ISubscription;
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};
