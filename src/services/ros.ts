import * as Realm from 'realm';

export interface IUser {
  userId: string;
  isAdmin: boolean;
  accounts: IAccount[];
  metadata: IUserMetadataRow[];
}

export interface IAccount {
  provider: string;
  providerId: string;
  user?: IUser[];
}

export interface IUserMetadataRow {
  user?: IUser[];
  key: string;
  value?: string;
}

export interface IRealmFile {
  path: string;
  creatorId: string;
  creationDate: Date;
  permissions: IPermission[];
}

export interface IPermission {
  user: IUser;
  mayRead: boolean;
  mayWrite: boolean;
  mayManage: boolean;
}

export enum AccessLevel {
  none,
  read,
  write,
  admin,
}

// These schemas are copied from ROS

const getRealmUrl = (user: Realm.Sync.User, path: string) => {
  const url = new URL(path, user.server);
  url.protocol = 'realm:';
  return url.toString();
};

export const timeoutPromise = (
  url: string,
  delay: number = 5000,
): Promise<Realm> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out opening Realm: ${url}`));
    }, delay);
  });
};

export const getAdminRealm = (user: Realm.Sync.User): Promise<Realm> => {
  const url = getRealmUrl(user, '__admin');
  const realm = Realm.open({
    path: './data/__admin.realm',
    sync: {
      url,
      user,
    },
  });
  return Promise.race<Realm>([realm, timeoutPromise(url)]);
};

export const createUser = async (
  server: string,
  username: string,
  password: string,
): Promise<string> => {
  // We could create the object in the synced realm, but that wont create the desired username and password
  const newUser = await Realm.Sync.User.register(server, username, password);
  newUser.logout();
  return newUser.identity;
};

export const deleteRealm = (userId: string) => {
  // mocked.deleteRealm(userId);
  throw new Error('Not yet implemented');
};

export const updateUserPassword = async (
  adminUser: Realm.Sync.User,
  userId: string,
  password: string,
) => {
  const server = adminUser.server;
  // TODO: This could be moved to Realm-JS instead
  const request = new Request(`${server}/auth/password`, {
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

export const updateRealm = (realmId: string, values: Partial<IRealmFile>) => {
  throw new Error('Not yet implemented');
};
