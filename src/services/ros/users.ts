import { IServerCredentials } from '.';

export const authenticate = async (
  credentials: IServerCredentials,
): Promise<Realm.Sync.User> => {
  if (credentials.kind === 'password') {
    return Realm.Sync.User.login(
      credentials.url,
      credentials.username,
      credentials.password,
    );
  } else if (credentials.kind === 'token') {
    return Realm.Sync.User.adminUser(credentials.token, credentials.url);
  } else if (credentials.kind === 'other') {
    // TODO: Remove this when the registerWithProvider has a simpler interface
    // @see https://github.com/realm/realm-js/issues/1451
    const options: any = {
      ...credentials.options,
    };
    if (!options.providerToken && options.data) {
      options.providerToken = options.data;
    }
    return Realm.Sync.User.registerWithProvider(credentials.url, options);
  } else {
    throw new Error(`Unexpected kind of credentials`);
  }
};

export const create = async (
  server: string,
  username: string,
  password: string,
): Promise<string> => {
  // We could create the object in the synced realm, but that wont create the desired username and password
  const newUser = await Realm.Sync.User.register(server, username, password);
  newUser.logout();
  return newUser.identity;
};

export const remove = async (adminUser: Realm.Sync.User, userId: string) => {
  const server = adminUser.server;
  const url = new URL(`/auth/user/${userId}`, server);
  // TODO: This could be moved to Realm-JS instead
  const request = new Request(url.toString(), {
    method: 'DELETE',
    headers: new Headers({
      Authorization: adminUser.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }),
  });
  // Perform the request
  const response = await fetch(request);
  return response.status === 200;
};

export const updatePassword = async (
  adminUser: Realm.Sync.User,
  userId: string,
  password: string,
) => {
  const server = adminUser.server;
  const url = new URL('/auth/password', server);
  const request = new Request(url.toString(), {
    method: 'PUT',
    headers: new Headers({
      Authorization: adminUser.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      user_id: userId,
      data: {
        new_password: password,
      },
    }),
  });
  // Perform the request
  const response = await fetch(request);
  return response.status === 200;
};
