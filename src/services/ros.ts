import * as Realm from "realm";
import * as mocked from "./mocked-ros";

export interface IAuthUser {
  userId: string;
  isAdmin: boolean;
}

export interface IAuthUserMetadata {
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

export const createUser = async (username: string, password: string) => {
  return await mocked.createUser(username, password);
};

export const deleteRealm = (userId: string) => {
  // mocked.deleteRealm(userId);
  throw new Error("Not yet implemented");
};

export const deleteUser = (userId: string) => {
  mocked.deleteUser(userId);
};

export const updateUser = (userId: string, values: Partial<IAuthUser>) => {
  return mocked.updateUser(userId, values);
};

export const updateUserPassword = (userId: string, password: string) => {
  return mocked.updateUserPassword(userId, password);
};

export const updateRealm = (realmId: string, values: Partial<IRealmFile>) => {
  throw new Error("Not yet implemented");
};
