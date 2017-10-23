import * as React from 'react';
import {
  AutoSizer,
  defaultCellRangeRenderer,
  Grid,
  GridCellRenderer,
  ScrollSync,
} from 'react-virtualized';
import * as Realm from 'realm';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  IHighlight,
  SortEndHandler,
} from './table';
import { TableContainer } from './table/TableContainer';
import { Topbar } from './Topbar';

export const Content = ({
  focus,
  highlight,
  onCellChange,
  onCellClick,
  onQueryChange,
  onSortEnd,
  progress,
  query,
}: {
  focus: IFocus | null;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onQueryChange: (query: string) => void;
  onSortEnd?: SortEndHandler;
  progress?: ILoadingProgress;
  query: string;
}) => {
  if (focus) {
    const headerHeight = 40;
    const rowHeight = 26;

    return (
      <div className="RealmBrowser__Content">
        <Topbar onQueryChange={onQueryChange} query={query} />
        <TableContainer
          focus={focus}
          highlight={highlight}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onSortEnd={onSortEnd}
          query={query}
        />
      </div>
    );
  } else if (progress && progress.done) {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
