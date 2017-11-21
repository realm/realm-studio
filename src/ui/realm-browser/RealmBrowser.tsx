import * as React from 'react';
import * as Realm from 'realm';

import { AutoSaveChangeHandler, ISelectObjectState } from '.';
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
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  isAutoSaveEnabled: boolean;
  isEncryptionDialogVisible: boolean;
  onAutoSaveChange: AutoSaveChangeHandler;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onContextMenu: CellContextMenuHandler;
  onDiscardChanges: () => void;
  onHideEncryptionDialog: () => void;
  onOpenWithEncryption: (key: string) => void;
  onSaveChanges: () => void;
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
  focus,
  getSchemaLength,
  highlight,
  isAutoSaveEnabled,
  isEncryptionDialogVisible,
  onAutoSaveChange,
  onCellChange,
  onCellClick,
  onContextMenu,
  onDiscardChanges,
  onHideEncryptionDialog,
  onOpenWithEncryption,
  onSaveChanges,
  onSchemaSelected,
  onSortEnd,
  onSortStart,
  progress,
  schemas,
  selectObject,
  updateObjectReference,
}: IRealmBrowserProps) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        dataVersion={dataVersion}
        dataVersionAtBeginning={dataVersionAtBeginning}
        focus={focus}
        getSchemaLength={getSchemaLength}
        isAutoSaveEnabled={isAutoSaveEnabled}
        onAutoSaveChange={onAutoSaveChange}
        onDiscardChanges={onDiscardChanges}
        onSaveChanges={onSaveChanges}
        onSchemaSelected={onSchemaSelected}
        progress={progress}
        schemas={schemas}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          dataVersion={dataVersion}
          focus={focus}
          highlight={highlight}
          isAutoSaveEnabled={isAutoSaveEnabled}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
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
