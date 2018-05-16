import * as React from 'react';

import { IHistoryEntry } from './HistoryEntry';
import { HistoryPanel } from './HistoryPanel';

class HistoryPanelContainer extends React.Component<
  {},
  {
    entries: IHistoryEntry[];
  }
> {
  constructor() {
    super();
    this.state = {
      entries: [
        /*
        { type: "server", url: "http://localhost:9080" } as IServerEntry,
        { type: "server", url: "https://localhost:9334" } as IServerEntry,
        { type: "synced-realm", url: "https://localhost:9334/~/realm-tasks" } as ISyncedRealmEntry,
        */
      ],
    };
  }

  public render() {
    return <HistoryPanel {...this.state} />;
  }
}

export { HistoryPanelContainer as HistoryPanel };
