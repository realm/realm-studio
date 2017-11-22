import * as React from 'react';
import {
  AutoSizer,
  defaultCellRangeRenderer,
  Grid,
  GridCellRenderer,
  ScrollSync,
} from 'react-virtualized';
import * as Realm from 'realm';

import { EditMode } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { Bottombar } from './Bottombar';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';
import { ResponsiveTable } from './table/ResponsiveTable';
import { Topbar } from './Topbar';

export const Content = ({
  changeCount,
  dataVersion,
  editMode,
  focus,
  highlight,
  inTransaction,
  onCancelTransaction,
  onCellChange,
  onCellClick,
  onCommitTransaction,
  onContextMenu,
  onQueryChange,
  onQueryHelp,
  onSortEnd,
  onSortStart,
  progress,
  query,
}: {
  changeCount: number;
  dataVersion?: number;
  editMode: EditMode;
  focus: IFocus | null;
  highlight?: IHighlight;
  inTransaction: boolean;
  onCancelTransaction: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCommitTransaction: () => void;
  onContextMenu?: CellContextMenuHandler;
  onQueryChange: (query: string) => void;
  onQueryHelp: () => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  progress?: ILoadingProgress;
  query: string;
}) => {
  if (focus) {
    const headerHeight = 40;
    const rowHeight = 26;

    return (
      <div className="RealmBrowser__Content">
        <Topbar
          onQueryChange={onQueryChange}
          onQueryHelp={onQueryHelp}
          query={query}
        />
        <ResponsiveTable
          dataVersion={dataVersion}
          editMode={editMode}
          focus={focus}
          highlight={highlight}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
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
  } else if (progress && progress.done && !progress.failure) {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
