import * as React from 'react';
import * as Realm from 'realm';

import {
  CreateObjectHandler,
  EditMode,
  IConfirmModal,
  ISelectObjectState,
} from '.';
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
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';

import './RealmBrowser.scss';

export interface IRealmBrowserProps {
  columnToHighlight?: number;
  confirmModal?: IConfirmModal;
  createObjectSchema?: Realm.ObjectSchema;
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  inTransaction: boolean;
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isClassNameAvailable: (name: string) => boolean;
  isEncryptionDialogVisible: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  onAddProperty: (property: Realm.PropertiesTypes) => void;
  onCancelTransaction: () => void;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onCellHighlighted: CellHighlightedHandler;
  onCellValidated: CellValidatedHandler;
  onClassSelected: (name: string, objectToScroll: any) => void;
  onCommitTransaction: () => void;
  onContextMenu: CellContextMenuHandler;
  onCreateDialogToggle: () => void;
  onNewObjectClick: () => void;
  onCreateObject: CreateObjectHandler;
  onHideEncryptionDialog: () => void;
  onOpenWithEncryption: (key: string) => void;
  onSortEnd: SortEndHandler;
  onSortStart: SortStartHandler;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
  selectObject?: ISelectObjectState;
  toggleAddSchema: () => void;
  toggleAddSchemaProperty: () => void;
  toggleSelectObject: () => void;
  updateObjectReference: (object: any) => void;
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
  onCellHighlighted,
  onCellValidated,
  onClassSelected,
  onCommitTransaction,
  onContextMenu,
  onNewObjectClick,
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
          onAddColumnClick={toggleAddSchemaProperty}
          onCancelTransaction={onCancelTransaction}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onCellHighlighted={onCellHighlighted}
          onCellValidated={onCellValidated}
          onCommitTransaction={onCommitTransaction}
          onContextMenu={onContextMenu}
          onNewObjectClick={onNewObjectClick}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          progress={progress}
        />
      </div>
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          description={confirmModal.description}
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
