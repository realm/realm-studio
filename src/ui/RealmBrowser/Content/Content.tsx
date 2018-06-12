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

import { ISorting, QueryChangeHandler, SortingChangeHandler } from '.';
import { ResponsiveTable } from './ResponsiveTable';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './Table';

export const Content = ({
  changeCount,
  dataVersion,
  editMode,
  filteredSortedResults,
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
  onSortingChange,
  onSortStart,
  onTableBackgroundClick,
  progress,
  query,
  sorting,
}: {
  changeCount?: number;
  dataVersion?: number;
  editMode: EditMode;
  filteredSortedResults: Realm.Collection<any>;
  focus: Focus;
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
  onQueryChange: QueryChangeHandler;
  onQueryHelp: () => void;
  onResetHighlight: () => void;
  onSortEnd?: SortEndHandler;
  onSortingChange: SortingChangeHandler;
  onSortStart?: SortStartHandler;
  onTableBackgroundClick: () => void;
  progress?: ILoadingProgress;
  query: string;
  sorting: ISorting | undefined;
}) => (
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
      filteredSortedResults={filteredSortedResults}
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
      onSortingChange={onSortingChange}
      onSortStart={onSortStart}
      onTableBackgroundClick={onTableBackgroundClick}
      query={query}
      sorting={sorting}
    />
    <Bottombar
      changeCount={changeCount}
      onCancelTransaction={onCancelTransaction}
      onCommitTransaction={onCommitTransaction}
      inTransaction={inTransaction}
    />
  </div>
);
