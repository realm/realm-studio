import * as React from "react";

import serverIcon from "realm-studio-svgs/server-icon.svg";
import syncedRealmFileIcon from "realm-studio-svgs/synced-realm-icon.svg";

export type HistoryEntryType = "server" | "local-realm" | "synced-realm";

export interface IHistoryEntry {
  type: HistoryEntryType;
}

export interface IServerEntry extends IHistoryEntry {
  url: string;
}

export interface ISyncedRealmEntry extends IHistoryEntry {
  url: string;
}

export const HistoryEntry = ({
  entry,
}: {
  entry: IHistoryEntry,
}) => {
  if (entry.type === "server") {
    const serverEntry = entry as IServerEntry;
    return (
      <div className="Greeting__HistoryPanel__Entry" title={serverEntry.url}>
        <svg viewBox={serverIcon.viewBox} className="Greeting__HistoryPanel__Icon">
          <use xlinkHref={serverIcon.url} />
        </svg>
        <div className="Greeting__HistoryPanel__Description">
          {serverEntry.url}
        </div>
      </div>
    );
  } else if (entry.type === "synced-realm") {
    const serverEntry = entry as IServerEntry;
    return (
      <div className="Greeting__HistoryPanel__Entry" title={serverEntry.url}>
        <svg viewBox={syncedRealmFileIcon.viewBox} className="Greeting__HistoryPanel__Icon">
          <use xlinkHref={syncedRealmFileIcon.url} />
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
