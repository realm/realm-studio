import * as React from 'react';
import {
  AutoSizer,
  defaultCellRangeRenderer,
  Grid,
  GridCellRenderer,
  ScrollSync,
} from 'react-virtualized';
import * as Realm from 'realm';

import { AutoSaveChangeHandler } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
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
  dataVersion,
  focus,
  highlight,
  isAutoSaveEnabled,
  onCellChange,
  onCellClick,
  onContextMenu,
  onQueryChange,
  onQueryHelp,
  onSortEnd,
  onSortStart,
  progress,
  query,
}: {
  dataVersion?: number;
  focus: IFocus | null;
  highlight?: IHighlight;
  isAutoSaveEnabled: boolean;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
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
          focus={focus}
          highlight={highlight}
          isAutoSaveEnabled={isAutoSaveEnabled}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onContextMenu={onContextMenu}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          query={query}
        />
      </div>
    );
  } else if (progress && progress.done && !progress.failure) {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
