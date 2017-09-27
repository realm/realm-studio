import * as React from "react";

import { IHistoryEntry, IServerEntry, ISyncedRealmEntry } from "./HistoryEntry";
import { HistoryPanel } from "./HistoryPanel";

export class HistoryPanelContainer extends React.Component<{}, {
  entries: IHistoryEntry[],
}> {

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
