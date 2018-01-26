import * as React from 'react';

import { HistoryEntry, IHistoryEntry } from './HistoryEntry';

const Empty = () => (
  <div className="Greeting__HistoryPanel__Empty">
    <p>Welcome to Realm Studio!</p>
    <p>
      We have announced Realm Cloud: Realm Platform as a Service:{' '}
      <a
        href="https://realm.io/blog/realm-cloud-beta-waitlist/"
        target="_blank"
      >
        Click to read more
      </a>.
    </p>
  </div>
);

export const HistoryPanel = ({ entries }: { entries: IHistoryEntry[] }) => (
  <div className="Greeting__HistoryPanel">
    {entries.map((entry, index) => <HistoryEntry entry={entry} key={index} />)}
    {entries.length === 0 ? <Empty /> : null}
  </div>
);
