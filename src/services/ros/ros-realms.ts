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
  mode: RealmLoadingMode.Synced;
  authentication: IServerCredentials | Realm.Sync.User;
}

export interface ILocalRealmToLoad extends IRealmToLoad {
  mode: RealmLoadingMode.Local;
}
