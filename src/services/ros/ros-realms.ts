import * as Realm from 'realm';
import { IServerCredentials } from './ros-authentication';

export enum RealmLoadingMode {
  Synced = 'synced',
  Local = 'local',
}

export interface IRealmToLoad {
  mode: RealmLoadingMode;
  path: string;
}

export interface ISyncedRealmToLoad extends IRealmToLoad {
  authentication: IServerCredentials | Realm.Sync.User;
}

// tslint:disable-next-line:no-empty-interface
export interface ILocalRealmToLoad extends IRealmToLoad {}
