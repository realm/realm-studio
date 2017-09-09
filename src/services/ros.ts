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

// These schemas are copied from ROS

export const userSchema: Realm.ObjectSchema = {
  name: "User",
  primaryKey: "userId",
  properties: {
    userId: "string",
    isAdmin: { type: "bool", optional: false },
    metadata: { type: "list", objectType: "UserMetadata" },
  },
};

export const metadataSchema: Realm.ObjectSchema = {
  name: "UserMetadata",
  properties: {
    userId: "string",
    key: "string",
    value: { type: "string", optional: true },
  },
};

export const realmFileSchema: Realm.ObjectSchema = {
  name: "RealmFile",
  primaryKey: "path",
  properties: {
    path: "string",
    creatorId: "string",
    creationDate: "date",
    permissions: {
      type: "list",
      objectType: "PermissionCondition",
    },
  },
};

export const permissionConditionSchema: Realm.ObjectSchema = {
  name: "PermissionCondition",
  properties: {
    path: "string",
    accessLevel: "int", // ['none', 'read', 'write', 'admin']
    type: "int", // ['all', 'user', 'metadata_exact', 'metadata_regex']
    key: { type: "string", optional: true },
    value: { type: "string", optional: true },
  },
};

const getRealmUrl = (user: Realm.Sync.User, path: string) => {
  const url = new URL(path, user.server);
  url.protocol = "realm:";
  return url.toString();
};

export const timeoutPromise = (url: string, delay: number = 5000): Promise<Realm> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out opening Realm: ${url}`));
    }, delay);
  });
};

export const getAuthRealm = (user: Realm.Sync.User): Promise<Realm> => {
  const url = getRealmUrl(user, "__admin");
  const realm = Realm.open({
    sync: {
      url,
      user,
    },
    schema: [
      userSchema,
      metadataSchema,
    ],
  });
  return Promise.race<Realm>([ realm, timeoutPromise(url) ]);
};

export const getRealmManagementRealm = (user: Realm.Sync.User): Promise<Realm> => {
  const url = getRealmUrl(user, "__permissions");
  const realm = Realm.open({
    sync: {
      url,
      user,
    },
    schema: [
      realmFileSchema,
      permissionConditionSchema,
    ],
  });
  return Promise.race<Realm>([ realm, timeoutPromise(url) ]);
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
