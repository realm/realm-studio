import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../github';

const TOKEN_STORAGE_KEY = 'realm-cloud-token';

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

const buildUrl = (path: string) => {
  return `https://raas.realmlab.net${path}`;
};

const fetchAuthenticated = (url: string, options: RequestInit) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
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

export const hasToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ? true : false;
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const forgetToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
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
