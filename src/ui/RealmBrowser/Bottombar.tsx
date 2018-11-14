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

import * as classNames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

export interface IBottombarProps {
  changeCount?: number;
  inTransaction?: boolean;
  onCancelTransaction?: () => void;
  onCommitTransaction?: () => void;
}

export const Bottombar = ({
  inTransaction,
  changeCount,
  onCancelTransaction,
  onCommitTransaction,
}: IBottombarProps) => (
  <section
    className={classNames('RealmBrowser__Bottombar', {
      'RealmBrowser__Bottombar--visible': inTransaction,
    })}
  >
    {inTransaction ? (
      <section className="RealmBrowser__Bottombar__UnsavedChanges">
        In a transaction with
        {changeCount === 0
          ? ' no changes'
          : changeCount === 1
          ? ` ${changeCount} change`
          : ` ${changeCount} changes`}
      </section>
    ) : null}

    {inTransaction ? (
      <section className="RealmBrowser__Bottombar__Controls">
        <Button color="primary" onClick={onCancelTransaction} size="sm">
          Cancel
        </Button>
        <Button size="sm" color="secondary" onClick={onCommitTransaction}>
          Commit transaction
        </Button>
      </section>
    ) : null}
  </section>
);
