import * as React from 'react';
import * as Realm from 'realm';

import { EditMode, ISelectObjectState } from '.';
import { ConfirmModal } from '../reusable/confirm-modal';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { ContentContainer } from './ContentContainer';
import { EncryptionDialog } from './encryption-dialog';
import { IFocus } from './focus';
import { ObjectSelectorContainer } from './object-selector/ObjectSelectorContainer';
import { Sidebar } from './Sidebar';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';

import './RealmBrowser.scss';

export interface IRealmBrowserProps {
  closeSelectObject: () => void;
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  inTransaction: boolean;
  isEncryptionDialogVisible: boolean;
  onCancelTransaction: () => void;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onCommitTransaction: () => void;
  onContextMenu: CellContextMenuHandler;
  onHideEncryptionDialog: () => void;
  onOpenWithEncryption: (key: string) => void;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  onSortEnd: SortEndHandler;
  onSortStart: SortStartHandler;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
  selectObject?: ISelectObjectState;
  updateObjectReference: (object: any) => void;
}

export const RealmBrowser = ({
  closeSelectObject,
  columnToHighlight,
  confirmModal,
  dataVersion,
  dataVersionAtBeginning,
  editMode,
  focus,
  getSchemaLength,
  highlight,
  inTransaction,
  isEncryptionDialogVisible,
  onCancelTransaction,
  onCellChange,
  onCellClick,
  onContextMenu,
  onCommitTransaction,
  onHideEncryptionDialog,
  onOpenWithEncryption,
  onSchemaSelected,
  onSortEnd,
  onSortStart,
  progress,
  schemas,
  selectObject,
  updateObjectReference,
}: IRealmBrowserProps) => {
  const changeCount =
    typeof dataVersionAtBeginning === 'number'
      ? dataVersion - dataVersionAtBeginning
      : 0;
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
          changeCount={changeCount}
          dataVersion={dataVersion}
          editMode={editMode}
          focus={focus}
          highlight={highlight}
          inTransaction={inTransaction}
          onCancelTransaction={onCancelTransaction}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onCommitTransaction={onCommitTransaction}
          onContextMenu={onContextMenu}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          progress={progress}
        />
      </div>
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

      <EncryptionDialog
        onHide={onHideEncryptionDialog}
        onOpenWithEncryption={onOpenWithEncryption}
        visible={isEncryptionDialogVisible}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
