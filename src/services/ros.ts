import * as Realm from "realm";

import * as mocked from "./mocked-ros";

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

export const userSchema: Realm.ObjectSchema = {
  name: "User",
  primaryKey: "userId",
  properties: {
      userId: { type: "string", optional: false },
      isAdmin: { type: "bool", optional: false },
      accounts: { type: "list", objectType: "Account" },
      metadata: { type: "list", objectType: "UserMetadataRow", default: [], optional: false }
      }
};

export const userMetadataRowSchema: Realm.ObjectSchema = {
  name: "UserMetadataRow",
  properties: {
      user: { type: "linkingObjects", objectType: "User", property: "metadata" },
      key: { type: "string", optional: false },
      value: { type: "string", optional: false }
  }
};

export const realmFileSchema: Realm.ObjectSchema = {
  name: "RealmFile",
  primaryKey: "path",
  properties: {
      path: "string",
      creatorId: { type: "string", optional: true, default: "realm-admin" },
      creationDate: "date",
      syncLabel: "string",
      permissions: { type: "list", objectType: "Permission", default: [], optional: false }
  }
};

export const permissionSchema: Realm.ObjectSchema = {
  name: "Permission",
  properties: {
      user: { type: "User" },
      owners: {type: "linkingObjects", objectType: "RealmFile", property: "permissions"},
      mayRead: { type: "bool", optional: false },
      mayWrite: { type: "bool", optional: false },
      mayManage: { type: "bool", optional: false },
      updatedAt: { type: "date", optional: false },
  }
};

export const accountSchema: Realm.ObjectSchema = {
  name: "Account",
  properties: {
      provider: { type: "string", optional: false, indexed: true },
      providerId: { type: "string", optional: false, indexed: true },
      user: {type: "linkingObjects", objectType: "User", property: "accounts"}
  }
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

export const getAdminRealm = (user: Realm.Sync.User): Promise<Realm> => {
  const url = getRealmUrl(user, "__admin");
  const realm = Realm.open({
    path: "./data/__admin.realm",
    sync: {
      url,
      user,
    },
    schema: [
      userSchema,
      userMetadataRowSchema,
      realmFileSchema,
      permissionSchema,
      accountSchema
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
