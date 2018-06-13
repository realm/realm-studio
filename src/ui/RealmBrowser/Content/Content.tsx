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

import { EditMode } from '..';
import { Bottombar } from '../Bottombar';
import { Focus, IClassFocus } from '../focus';

import { ISorting, QueryChangeHandler, SortingChangeHandler } from '.';
import {
  CreateObjectDialog,
  ICreateObjectDialogContainerProps,
} from './CreateObjectDialog';
import {
  DeleteObjectsDialog,
  IDeleteObjectsDialogProps,
} from './DeleteObjectsDialog';
import { ResponsiveTable } from './ResponsiveTable';
import {
  ISelectObjectDialogContainerProps,
  SelectObjectDialog,
} from './SelectObjectDialog';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  ReorderingEndHandler,
  ReorderingStartHandler,
} from './Table';
import { TopBar } from './TopBar';

interface IBaseContentProps {
  dataVersion?: number;
  editMode: EditMode;
  error?: Error;
  filteredSortedResults: Realm.Collection<any>;
  focus: Focus;
  highlight?: IHighlight;
  onAddColumnClick?: () => void;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onCellHighlighted: CellHighlightedHandler;
  onCellValidated: CellValidatedHandler;
  onContextMenu: CellContextMenuHandler;
  onNewObjectClick?: () => void;
  onQueryChange: QueryChangeHandler;
  onQueryHelp: () => void;
  onResetHighlight: () => void;
  onSortingChange: SortingChangeHandler;
  onTableBackgroundClick: () => void;
  query: string;
  sorting?: ISorting;
}

interface IReadOnlyContentProps extends IBaseContentProps {
  editMode: EditMode.Disabled;
  readOnly: true;
}

interface IReadWriteContentProps extends IBaseContentProps {
  changeCount: number;
  createObjectDialog: ICreateObjectDialogContainerProps;
  deleteObjectsDialog: IDeleteObjectsDialogProps;
  editMode: EditMode;
  getClassFocus: (className: string) => IClassFocus;
  inTransaction: boolean;
  onCancelTransaction: () => void;
  onCommitTransaction: () => void;
  onReorderingEnd: ReorderingEndHandler;
  onReorderingStart: ReorderingStartHandler;
  readOnly: false;
  selectObjectDialog: ISelectObjectDialogContainerProps;
}

export type IContentProps = IReadOnlyContentProps | IReadWriteContentProps;

export const Content = ({
  dataVersion,
  editMode,
  error,
  filteredSortedResults,
  focus,
  highlight,
  onAddColumnClick,
  onCellChange,
  onCellClick,
  onCellHighlighted,
  onCellValidated,
  onContextMenu,
  onNewObjectClick,
  onQueryChange,
  onQueryHelp,
  onResetHighlight,
  onSortingChange,
  onTableBackgroundClick,
  query,
  sorting,
  ...props
}: IContentProps) =>
  error ? (
    <div className="RealmBrowser__Content RealmBrowser__Content--error">
      <span className="RealmBrowser__Content__Error">{error.message}</span>
    </div>
  ) : (
    <div className="RealmBrowser__Content">
      <TopBar
        focus={focus}
        onNewObjectClick={onNewObjectClick}
        onQueryChange={onQueryChange}
        onQueryHelp={onQueryHelp}
        query={query}
        readOnly={props.readOnly}
      />
      <ResponsiveTable
        dataVersion={dataVersion}
        editMode={editMode}
        filteredSortedResults={filteredSortedResults}
        focus={focus}
        highlight={highlight}
        onAddColumnClick={focus.kind === 'class' ? onAddColumnClick : undefined}
        onCellChange={onCellChange}
        onCellClick={onCellClick}
        onCellHighlighted={onCellHighlighted}
        onCellValidated={onCellValidated}
        onContextMenu={onContextMenu}
        onReorderingEnd={props.readOnly ? undefined : props.onReorderingEnd}
        onReorderingStart={props.readOnly ? undefined : props.onReorderingStart}
        onResetHighlight={onResetHighlight}
        onSortingChange={onSortingChange}
        onTableBackgroundClick={onTableBackgroundClick}
        query={query}
        readOnly={props.readOnly}
        sorting={sorting}
      />

      {!props.readOnly ? (
        <React.Fragment>
          <Bottombar
            changeCount={props.changeCount}
            onCancelTransaction={props.onCancelTransaction}
            onCommitTransaction={props.onCommitTransaction}
            inTransaction={props.inTransaction}
          />
          <CreateObjectDialog {...props.createObjectDialog} />
          <SelectObjectDialog {...props.selectObjectDialog} />
          <DeleteObjectsDialog {...props.deleteObjectsDialog} />
        </React.Fragment>
      ) : null}
    </div>
  );
