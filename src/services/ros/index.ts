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

export interface IRealmFile {
  path: string;
  syncLabel: string;
  owner: IUser;
  createdAt: Date;
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

// An enum to describe a users role

export enum UserRole {
  Administrator = 'administrator',
  Regular = 'regular',
}

export const isAvailable = async (url: string) => {
  const response = await fetch(`${url}/health`);
  return response.status === 200;
};
