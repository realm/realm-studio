import * as React from 'react';

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
  hasEditingDisabled,
  highlight,
  onCellChange,
  onCellClick,
  onContextMenu,
  onQueryChange,
  onSortEnd,
  onSortStart,
  progress,
  query,
  onAddColumnClick,
}: {
  dataVersion?: number;
  focus: IFocus | null;
  hasEditingDisabled?: boolean;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onQueryChange: (query: string) => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  progress?: ILoadingProgress;
  query: string;
  onAddColumnClick?: () => void;
}) => {
  if (focus) {
    return (
      <div className="RealmBrowser__Content">
        <Topbar onQueryChange={onQueryChange} query={query} />
        <ResponsiveTable
          dataVersion={dataVersion}
          focus={focus}
          hasEditingDisabled={hasEditingDisabled}
          highlight={highlight}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onContextMenu={onContextMenu}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          query={query}
          onAddColumnClick={onAddColumnClick}
        />
      </div>
    );
  } else if (progress && progress.done && !progress.failure) {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
