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

export interface IRealm {
  //
}

// TODO: Sync this up with the actual servers Realms

export const getAuthRealm = (user: Realm.Sync.User) => {
  return mocked.getAuthRealm();
};

export const getRealmManagementRealm = (user: Realm.Sync.User) => {
  return mocked.getRealmManagementRealm();
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

export const updateRealm = (realmId: string, values: Partial<IRealm>) => {
  throw new Error("Not yet implemented");
};
