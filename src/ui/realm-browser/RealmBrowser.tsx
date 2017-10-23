import * as React from 'react';
import * as Realm from 'realm';

import { ISelectObjectState } from '.';
import { ConfirmModal } from '../reusable/confirm-modal';
import { ContextMenu } from '../reusable/context-menu';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { ContentContainer } from './ContentContainer';
import { IFocus } from './focus';
import { ObjectSelectorContainer } from './object-selector/ObjectSelectorContainer';
import { Sidebar } from './Sidebar';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
} from './table';

import './RealmBrowser.scss';

export const RealmBrowser = ({
  closeSelectObject,
  columnToHighlight,
  confirmModal,
  contextMenu,
  focus,
  getSchemaLength,
  highlight,
  onCellChange,
  onCellClick,
  onContextMenu,
  onContextMenuClose,
  onSchemaSelected,
  onSortEnd,
  progress,
  rowToHighlight,
  schemas,
  selectObject,
  updateObjectReference,
}: {
  closeSelectObject: () => void;
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  contextMenu: any;
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onContextMenu: CellContextMenuHandler;
  onContextMenuClose: () => void;
  onSortEnd: SortEndHandler;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  progress: ILoadingProgress;
  rowToHighlight?: number;
  schemas: Realm.ObjectSchema[];
  selectObject?: ISelectObjectState;
  updateObjectReference: (object: any) => void;
}) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        focus={focus}
        getSchemaLength={getSchemaLength}
        onSchemaSelected={onSchemaSelected}
        progress={progress}
        schemas={schemas}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          focus={focus}
          highlight={highlight}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onContextMenu={onContextMenu}
          onSortEnd={onSortEnd}
          progress={progress}
        />
      </div>
      {contextMenu && (
        <ContextMenu {...contextMenu} close={onContextMenuClose} />
      )}
      {confirmModal && (
        <ConfirmModal
          title="Deleting object ..."
          description="Are you sure you want to delete this object?"
          status={true}
          yes={confirmModal.yes}
          no={confirmModal.no}
        />
      )}

      {selectObject && (
        <ObjectSelectorContainer
          focus={selectObject.focus}
          property={selectObject.property}
          status={!!selectObject}
          onObjectSelected={updateObjectReference}
          close={closeSelectObject}
        />
      )}

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
