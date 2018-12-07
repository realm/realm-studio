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
import { Button } from 'reactstrap';

import { main } from '../../../actions/main';
import { HistoryEntry, IHistoryEntry } from './HistoryEntry';

const Empty = () => (
  <div className="Greeting__HistoryPanel__Empty">
    <p>Welcome to Realm Studio!</p>
    <p>Sync your data and objects in real-time via Realm Cloud:</p>
    <p>
      <Button
        size="sm"
        color="primary"
        onClick={() => main.showCloudAuthentication({ mode: 'sign-up' })}
      >
        Sign up (free trial)
      </Button>
      <br />
      {' or '}
      <a href="https://realm.io/pricing" target="_blank">
        view plans
      </a>
    </p>
  </div>
);

export const HistoryPanel = ({ entries }: { entries: IHistoryEntry[] }) => (
  <div className="Greeting__HistoryPanel">
    {entries.map((entry, index) => (
      <HistoryEntry entry={entry} key={index} />
    ))}
    {entries.length === 0 ? <Empty /> : null}
  </div>
);
