import * as React from 'react';

import { HistoryEntry, IHistoryEntry } from './HistoryEntry';

const Empty = () => (
  <div className="Greeting__HistoryPanel__Empty">
    <p>Welcome to Realm Studio!</p>
    <p>
      <a
        href="https://realm.io/docs/realm-object-server/"
        target="_blank"
      >
        Download and start the Realm Object Server
      </a>, if you have not already done that.
    </p>
  </div>
);

export const HistoryPanel = ({ entries }: { entries: IHistoryEntry[] }) => (
  <div className="Greeting__HistoryPanel">
    {entries.map((entry, index) => <HistoryEntry entry={entry} key={index} />)}
    {entries.length === 0 ? <Empty /> : null}
  </div>
);
