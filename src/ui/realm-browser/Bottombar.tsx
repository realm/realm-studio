import * as classNames from 'classnames';
import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';

export interface IBottombarProps {
  changeCount: number;
  inTransaction: boolean;
  onCancelTransaction: () => void;
  onCommitTransaction: () => void;
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
        <Button color="secondary" onClick={onCancelTransaction} size="sm">
          Cancel
        </Button>
        <Button size="sm" color="primary" onClick={onCommitTransaction}>
          Commit transaction
        </Button>
      </section>
    ) : null}
  </section>
);
