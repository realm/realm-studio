import * as React from 'react';

import { Button } from 'reactstrap';
import { EditMode } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { QuerySearch } from '../reusable/QuerySearch';
import { Bottombar } from './Bottombar';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';
import { ResponsiveTable } from './table/ResponsiveTable';

export const Content = ({
  changeCount,
  dataVersion,
  editMode,
  focus,
  highlight,
  inTransaction,
  onAddColumnClick,
  onCancelTransaction,
  onCellChange,
  onCellClick,
  onCellHighlighted,
  onCellValidated,
  onCommitTransaction,
  onContextMenu,
  onNewObjectClick,
  onQueryChange,
  onQueryHelp,
  onSortEnd,
  onSortStart,
  progress,
  query,
}: {
  changeCount?: number;
  dataVersion?: number;
  editMode: EditMode;
  focus: IFocus | null;
  highlight?: IHighlight;
  inTransaction?: boolean;
  onAddColumnClick?: () => void;
  onCancelTransaction?: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
  onCommitTransaction?: () => void;
  onContextMenu?: CellContextMenuHandler;
  onNewObjectClick: () => void;
  onQueryChange: (query: string) => void;
  onQueryHelp: () => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  progress?: ILoadingProgress;
  query: string;
}) => {
  if (focus) {
    return (
      <div className="RealmBrowser__Content">
        <div className="RealmBrowser__Topbar">
          <QuerySearch
            className="RealmBrowser__Topbar__Filter"
            onQueryChange={onQueryChange}
            onQueryHelp={onQueryHelp}
            query={query}
            placeholder="Enter a query to filter the list"
          />
          <Button
            size="sm"
            color="primary"
            className="RealmBrowser__Topbar__Button"
            onClick={onNewObjectClick}
          >
            New object
          </Button>
        </div>
        <ResponsiveTable
          dataVersion={dataVersion}
          editMode={editMode}
          focus={focus}
          highlight={highlight}
          onAddColumnClick={onAddColumnClick}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onCellHighlighted={onCellHighlighted}
          onCellValidated={onCellValidated}
          onContextMenu={onContextMenu}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          query={query}
        />
        <Bottombar
          changeCount={changeCount}
          onCancelTransaction={onCancelTransaction}
          onCommitTransaction={onCommitTransaction}
          inTransaction={inTransaction}
        />
      </div>
    );
  } else if (progress && progress.status !== 'done') {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
