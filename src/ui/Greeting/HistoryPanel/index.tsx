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

import React from 'react';

import { IHistoryEntry } from './HistoryEntry';
import { HistoryPanel } from './HistoryPanel';

interface IHistoryPanelContainerState {
  entries: IHistoryEntry[];
}

class HistoryPanelContainer extends React.Component<
  Record<string, never>,
  IHistoryPanelContainerState
> {
  public state: IHistoryPanelContainerState = {
    entries: [
      /*
      { type: "server", url: "http://localhost:9080" } as IServerEntry,
      { type: "server", url: "https://localhost:9334" } as IServerEntry,
      { type: "synced-realm", url: "https://localhost:9334/~/realm-tasks" } as ISyncedRealmEntry,
      */
    ],
  };

  public render() {
    return <HistoryPanel {...this.state} />;
  }
}

export { HistoryPanelContainer as HistoryPanel };
