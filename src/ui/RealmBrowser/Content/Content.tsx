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

import { EditMode } from '..';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { QuerySearch } from '../../reusable/QuerySearch';
import { Bottombar } from '../Bottombar';
import { Focus, getClassName } from '../focus';
import { ResponsiveTable } from '../ResponsiveTable';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from '../Table';

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
  onResetHighlight,
  onSortEnd,
  onSortStart,
  onTableBackgroundClick,
  progress,
  query,
}: {
  changeCount?: number;
  dataVersion?: number;
  editMode: EditMode;
  focus: Focus | null;
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
  onNewObjectClick?: () => void;
  onQueryChange: (query: string) => void;
  onQueryHelp: () => void;
  onResetHighlight: () => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  onTableBackgroundClick: () => void;
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
          {onNewObjectClick ? (
            <Button
              size="sm"
              color="primary"
              className="RealmBrowser__Topbar__Button"
              onClick={onNewObjectClick}
              title={`Create new ${getClassName(focus)}`}
            >
              Create new {getClassName(focus)}
            </Button>
          ) : null}
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
          onResetHighlight={onResetHighlight}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          onTableBackgroundClick={onTableBackgroundClick}
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
