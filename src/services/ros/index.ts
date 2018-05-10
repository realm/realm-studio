import { remote as electron } from 'electron';
import * as path from 'path';

import * as realms from './realms';
import * as users from './users';

export { realms, users };
export * from './credentials';

// These interfaces are copied from ROS

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

export type RealmType = 'reference' | 'partial' | 'full';

export interface IRealmFile {
  path: string;
  syncLabel: string;
  owner: IUser;
  createdAt: Date;
  permissions: IPermission[];
  realmType?: RealmType;
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

// An enum to describe a users role

export enum UserRole {
  Administrator = 'administrator',
  Regular = 'regular',
}

export const isAvailable = async (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.pathname = 'health';
  const response = await fetch(parsedUrl.toString());
  return response.status === 200;
};
