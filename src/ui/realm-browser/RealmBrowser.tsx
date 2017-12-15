import * as React from 'react';
import * as Realm from 'realm';

import { CreateObjectHandler, EditMode, ISelectObjectState } from '.';
import { ConfirmModal } from '../reusable/confirm-modal';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { AddClassModal } from './AddClassModal';
import { AddPropertyModal } from './AddPropertyModal';
import { ContentContainer } from './ContentContainer';
import { CreateObjectDialog } from './create-object-dialog';
import { EncryptionDialog } from './encryption-dialog';
import { Focus, IClassFocus } from './focus';
import { ObjectSelector } from './object-selector';
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
  toggleSelectObject: () => void;
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  createObjectSchema?: Realm.ObjectSchema;
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  inTransaction: boolean;
  isEncryptionDialogVisible: boolean;
  onCancelTransaction: () => void;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onCommitTransaction: () => void;
  onContextMenu: CellContextMenuHandler;
  onCreateDialogToggle: () => void;
  onCreateObject: CreateObjectHandler;
  onHideEncryptionDialog: () => void;
  onOpenWithEncryption: (key: string) => void;
  onClassSelected: (name: string, objectToScroll: any) => void;
  onSortEnd: SortEndHandler;
  onSortStart: SortStartHandler;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
  selectObject?: ISelectObjectState;
  updateObjectReference: (object: any) => void;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  isAddClassOpen: boolean;
  toggleAddSchema: () => void;
  isClassNameAvailable: (name: string) => boolean;
  onAddProperty: (property: Realm.PropertiesTypes) => void;
  isAddPropertyOpen: boolean;
  toggleAddSchemaProperty: () => void;
  isPropertyNameAvailable: (name: string) => boolean;
}

export const RealmBrowser = ({
  columnToHighlight,
  confirmModal,
  createObjectSchema,
  dataVersion,
  dataVersionAtBeginning,
  editMode,
  focus,
  getClassFocus,
  getSchemaLength,
  highlight,
  inTransaction,
  isAddClassOpen,
  isAddPropertyOpen,
  isClassNameAvailable,
  isEncryptionDialogVisible,
  isPropertyNameAvailable,
  onAddClass,
  onAddProperty,
  onCancelTransaction,
  onCellChange,
  onCellClick,
  onClassSelected,
  onCommitTransaction,
  onContextMenu,
  onCreateDialogToggle,
  onCreateObject,
  onHideEncryptionDialog,
  onOpenWithEncryption,
  onSortEnd,
  onSortStart,
  progress,
  schemas,
  selectObject,
  toggleAddSchema,
  toggleAddSchemaProperty,
  toggleSelectObject,
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
        onClassSelected={onClassSelected}
        progress={progress}
        schemas={schemas}
        toggleAddSchema={toggleAddSchema}
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
          onAddColumnClick={toggleAddSchemaProperty}
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
        <ObjectSelector
          toggle={toggleSelectObject}
          focus={selectObject.focus}
          isOpen={!!selectObject}
          isOptional={selectObject.property.optional}
          onObjectSelected={updateObjectReference}
        />
      )}

      <AddClassModal
        isOpen={isAddClassOpen}
        isClassNameAvailable={isClassNameAvailable}
        onAddClass={onAddClass}
        toggle={toggleAddSchema}
      />

      {focus && focus.kind === 'class' ? (
        <AddPropertyModal
          focus={focus}
          isOpen={isAddPropertyOpen}
          isPropertyNameAvailable={isPropertyNameAvailable}
          onAddProperty={onAddProperty}
          schemas={schemas}
          toggle={toggleAddSchemaProperty}
        />
      ) : null}

      <EncryptionDialog
        onHide={onHideEncryptionDialog}
        onOpenWithEncryption={onOpenWithEncryption}
        visible={isEncryptionDialogVisible}
      />

      <CreateObjectDialog
        getClassFocus={getClassFocus}
        isOpen={!!createObjectSchema}
        onCreate={onCreateObject}
        schema={createObjectSchema}
        toggle={onCreateDialogToggle}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
