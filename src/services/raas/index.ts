import { store } from '../../store';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../github';
import { IServerCredentials } from '../ros';

const TOKEN_STORAGE_KEY = 'cloud.token';
export const DEFAULT_TENANT_KEY = 'cloud.defaultTenant';

export interface IRaasAuthenticationResponse {
  token: string;
}

export interface ICreateTenantOptions {
  id: string;
  initialPassword: string;
}

// {"id":"test1","owner":"github/alebsack","status":"Running","url":"https://test1.ie1.raas.realmlab.net"}
export interface ITenant {
  id: string;
  owner: string;
  status: string;
  url: string;
}

// {"id":"ie1","controllerUrl":"https://ie1.raas.realmlab.net","region":"ireland","label":"Ireland Dev 1"}
export interface IServiceShard {
  id: string;
  controllerUrl: string;
  region: string;
  label: string;
  tenants: ITenant[];
}

export interface IDefaultTenant {
  controllerUrl: string;
  id: string;
  credentials: IServerCredentials;
}

const buildUrl = (path: string) => {
  return `https://raas.realmlab.net${path}`;
};

const fetchAuthenticated = (url: string, options: RequestInit) => {
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

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    return (await response.json()).message;
  } catch (err) {
    return 'Error without a message from RaaS';
  }
};

export const hasDefaultTenant = () => {
  return store.has(DEFAULT_TENANT_KEY);
};

export const getDefaultTenant = (): IDefaultTenant => {
  return store.get(DEFAULT_TENANT_KEY);
};

export const setDefaultTenant = (tenant: IDefaultTenant) => {
  store.set(DEFAULT_TENANT_KEY, tenant);
};

export const forgetDefaultTenant = () => {
  store.delete(DEFAULT_TENANT_KEY);
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

export const authenticate = async (
  githubCode: string,
): Promise<IRaasAuthenticationResponse> => {
  const response = await fetch(buildUrl('/api/auth/github'), {
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

export const getServiceShards = async () => {
  const response = await fetchAuthenticated(buildUrl('/api/service-shards'), {
    method: 'GET',
  });
  if (response.ok) {
    return (await response.json()) as IServiceShard[];
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const getTenants = async (controllerUrl: string) => {
  const response = await fetchAuthenticated(`${controllerUrl}/tenants`, {
    method: 'GET',
  });
  if (response.ok) {
    return response.json();
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const deleteTenant = async (controllerUrl: string, id: string) => {
  const response = await fetchAuthenticated(`${controllerUrl}/tenants/${id}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    return true;
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};

export const createTenant = async (
  controllerUrl: string,
  options: ICreateTenantOptions,
) => {
  const response = await fetchAuthenticated(`${controllerUrl}/tenants`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
  if (response.ok) {
    return true;
  } else {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }
};
