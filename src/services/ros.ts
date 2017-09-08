import * as Realm from "realm";
import * as mocked from "./mocked-ros";

export interface IUser {
  userId: string;
  isAdmin: boolean;
  metadata: IUserMetadata[];
}

export interface IUserMetadata {
  userId: string;
  key: string;
  value?: string;
}

export interface IRealmFile {
  path: string;
  creatorId: string;
  creationDate: Date;
  permissions: IPermissionCondition[];
}

export enum AccessLevel {
  none,
  read,
  write,
  admin,
}

export enum PermissionConditionType {
  all,
  user,
  metadata_exact,
  metadata_regex,
}

export interface IPermissionCondition {
  path: string;
  accessLevel: AccessLevel;
  type: PermissionConditionType;
  key?: string;
  value?: string;
}

// TODO: Sync this up with the actual servers Realms

export const getAuthRealm = (user: Realm.Sync.User) => {
  return mocked.getAuthRealm();
};

export const getRealmManagementRealm = (user: Realm.Sync.User) => {
  return mocked.getRealmManagementRealm();
};

export const createUser = async (server: string, username: string, password: string): Promise<string> => {
  const newUser = await new Promise<Realm.Sync.User>((resolve, reject) => {
      // We could create the object in the synced realm, but that wont create the desired username and password
      Realm.Sync.User.register(server, username, password, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
  });
  newUser.logout();
  return newUser.identity;
};

export const deleteRealm = (userId: string) => {
  // mocked.deleteRealm(userId);
  throw new Error("Not yet implemented");
};

export const updateUserPassword = (userId: string, password: string) => {
  return mocked.updateUserPassword(userId, password);
};

export const updateRealm = (realmId: string, values: Partial<IRealmFile>) => {
  throw new Error("Not yet implemented");
};
