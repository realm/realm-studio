import * as React from 'react';
import * as Realm from 'realm';

import { CreateObjectHandler, ISelectObjectState } from '.';
import { ConfirmModal } from '../reusable/confirm-modal';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { AddSchemaModal } from './AddSchemaModal';
import { AddSchemaPropertyModal } from './AddSchemaPropertyModal';
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
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  isEncryptionDialogVisible: boolean;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onContextMenu: CellContextMenuHandler;
  onCreateDialogToggle: () => void;
  onCreateObject: CreateObjectHandler;
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
  onAddSchemaProperty: (name: string) => void;
  isAddSchemaPropertyOpen: boolean;
  toggleAddSchemaProperty: () => void;
  isPropertyNameAvailable: (name: string) => boolean;
}

export const RealmBrowser = ({
  toggleSelectObject,
  columnToHighlight,
  confirmModal,
  createObjectSchema,
  dataVersion,
  focus,
  getClassFocus,
  getSchemaLength,
  highlight,
  isEncryptionDialogVisible,
  onCellChange,
  onCellClick,
  onContextMenu,
  onCreateDialogToggle,
  onCreateObject,
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
  onAddSchemaProperty,
  isAddSchemaPropertyOpen,
  toggleAddSchemaProperty,
  isPropertyNameAvailable,
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
          toggleAddSchemaProperty={toggleAddSchemaProperty}
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

      <AddSchemaModal
        isOpen={isAddSchemaOpen}
        toggle={toggleAddSchema}
        onAddSchema={onAddSchema}
        isSchemaNameAvailable={isSchemaNameAvailable}
      />

      <AddSchemaPropertyModal
        isOpen={isAddSchemaPropertyOpen}
        toggle={toggleAddSchemaProperty}
        onAddSchemaProperty={onAddSchemaProperty}
        isPropertyNameAvailable={isPropertyNameAvailable}
      />

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
