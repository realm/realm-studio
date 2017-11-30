import * as React from 'react';
import * as Realm from 'realm';

import { ISelectObjectState } from '.';
import { ConfirmModal } from '../reusable/confirm-modal';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { AddSchemaModal } from './AddSchemaModal';
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
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  isEncryptionDialogVisible: boolean;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onContextMenu: CellContextMenuHandler;
  onHideEncryptionDialog: () => void;
  onOpenWithEncryption: (key: string) => void;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  onSortEnd: SortEndHandler;
  onSortStart: SortStartHandler;
  progress: ILoadingProgress;
  rowToHighlight?: number;
  schemas: Realm.ObjectSchema[];
  selectObject?: ISelectObjectState;
  updateObjectReference: (object: any) => void;
  onAddSchema: (name: string) => void;
  isAddSchemaOpen: boolean;
  toggleAddSchema: () => void;
  isSchemaNameAvailable: (name: string) => boolean;
}

export const RealmBrowser = ({
  closeSelectObject,
  columnToHighlight,
  confirmModal,
  dataVersion,
  focus,
  getSchemaLength,
  highlight,
  isEncryptionDialogVisible,
  onCellChange,
  onCellClick,
  onContextMenu,
  onHideEncryptionDialog,
  onOpenWithEncryption,
  onSchemaSelected,
  onSortEnd,
  onSortStart,
  progress,
  rowToHighlight,
  schemas,
  selectObject,
  updateObjectReference,
  onAddSchema,
  isAddSchemaOpen,
  toggleAddSchema,
  isSchemaNameAvailable,
}: IRealmBrowserProps) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        focus={focus}
        getSchemaLength={getSchemaLength}
        onSchemaSelected={onSchemaSelected}
        progress={progress}
        schemas={schemas}
        toggleAddSchema={toggleAddSchema}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          dataVersion={dataVersion}
          focus={focus}
          highlight={highlight}
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

      <AddSchemaModal
        isOpen={isAddSchemaOpen}
        toggle={toggleAddSchema}
        onAddSchema={onAddSchema}
        isSchemaNameAvailable={isSchemaNameAvailable}
      />

      <EncryptionDialog
        onHide={onHideEncryptionDialog}
        onOpenWithEncryption={onOpenWithEncryption}
        visible={isEncryptionDialogVisible}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
