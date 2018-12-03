////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { createRealmContext } from 'react-realm-context';

const {
  RealmProvider: MetricsRealmProvider,
  RealmConsumer: MetricsRealmConsumer,
  RealmQuery: MetricsRealmQuery,
  RealmConnection: RealmMetricsConnection,
  withRealm: withMetricsRealm,
} = createRealmContext();

export function getMetricsRealmConfig(
  user: Realm.Sync.User,
  partialConfig: Realm.PartialConfiguration = {},
) {
  const config = user.createConfiguration(partialConfig);
  // TODO: Simplify this once https://github.com/realm/realm-js/issues/1981 is fixed
  if (config.sync && config.sync.url) {
    config.sync.url = config.sync.url.replace('/default', '/__metrics');
    config.sync.fullSynchronization = true;
  }
  return config;
}

/**
 * Represents a realm_state_size being emitted from the server
 */
export interface IRealmStateSize {
  /**
   * The path of the Realm this metric is capturing the state size of.
   */
  path: string;

  /**
   * The size of the Realms current state.
   */
  value: number;

  /**
   * When this metric was emitted.
   */
  emitted: Date;
}

/**
 * Represents a realm_file_size being emitted from the server
 */
export interface IRealmFileSize {
  /**
   * The path of the Realm this metric is capturing the file size of.
   */
  path: string;

  /**
   * The size of the Realm on disk.
   */
  value: number;

  /**
   * When this metric was emitted.
   */
  emitted: Date;
}

export {
  MetricsRealmProvider,
  MetricsRealmConsumer,
  MetricsRealmQuery,
  RealmMetricsConnection,
  withMetricsRealm,
};
