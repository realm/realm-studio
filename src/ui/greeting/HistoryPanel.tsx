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

export const HistoryPanel = ({
  entries,
}: {
  entries: IHistoryEntry[];
}) => (
  <div className="Greeting__HistoryPanel">
    {entries.map((entry) => {
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
    })}
    { entries.length === 0 ? (
      <div className="Greeting__HistoryPanel__Empty">
        <p>Welcome to Realm Studio!</p>
        <p>
          Download and start the&nbsp;
          <a href="https://realm.io/docs/realm-object-server/" target="browser">
            Realm Object Server
          </a>, if you have not already done that.
        </p>
      </div>
    ) : null }
  </div>
);
