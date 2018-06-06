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

import * as React from 'react';

import serverIcon from '../../../../static/svgs/server-icon.svg';
import syncedRealmFileIcon from '../../../../static/svgs/synced-realm-icon.svg';

export type HistoryEntryType = 'server' | 'local-realm' | 'synced-realm';

export interface IHistoryEntry {
  type: HistoryEntryType;
}

export interface IServerEntry extends IHistoryEntry {
  url: string;
}

export interface ISyncedRealmEntry extends IHistoryEntry {
  url: string;
}

export const HistoryEntry = ({ entry }: { entry: IHistoryEntry }) => {
  if (entry.type === 'server') {
    const serverEntry = entry as IServerEntry;
    return (
      <div className="Greeting__HistoryPanel__Entry" title={serverEntry.url}>
        <svg
          viewBox={serverIcon.viewBox}
          className="Greeting__HistoryPanel__Icon"
        >
          <use xlinkHref={`#${serverIcon.id}}`} />
        </svg>
        <div className="Greeting__HistoryPanel__Description">
          {serverEntry.url}
        </div>
      </div>
    );
  } else if (entry.type === 'synced-realm') {
    const serverEntry = entry as IServerEntry;
    return (
      <div className="Greeting__HistoryPanel__Entry" title={serverEntry.url}>
        <svg
          viewBox={syncedRealmFileIcon.viewBox}
          className="Greeting__HistoryPanel__Icon"
        >
          <use xlinkHref={`#${syncedRealmFileIcon.id}`} />
        </svg>
        <div className="Greeting__HistoryPanel__Description">
          {serverEntry.url}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
