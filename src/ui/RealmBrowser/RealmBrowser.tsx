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

import React from 'react';
import Realm from 'realm';

import { ILoadingProgress, LoadingOverlay } from '../reusable/LoadingOverlay';
import { ImportableFile, ImportFormat } from '../../services/data-importer';

import {
  ClassFocussedHandler,
  ListFocussedHandler,
  IsEmbeddedTypeChecker,
  SingleListFocussedHandler,
  JsonViewerDialogExecutor,
} from '.';
import { AddClassModal } from './AddClassModal';
import { AddPropertyModal } from './AddPropertyModal';
import { AddSubscriptionModal } from './AddSubscriptionModal';
import { Content, EditMode, HighlightMode } from './Content';
import { EncryptionDialog } from './EncryptionDialog';
import { Focus, IClassFocus } from './focus';
import { LeftSidebar } from './LeftSidebar';
import { NoFocusPlaceholder } from './NoFocusPlaceholder';
import { NoSubscriptionsPlaceholder } from './NoSubscriptionsPlaceholder';
import { EmbeddedFocusPlaceholder } from './EmbeddedFocusPlaceholder';
import { ImportDialog } from './ImportDialog';
import { JsonViewerDialog } from './JsonViewerDialog';

import './RealmBrowser.scss';

export interface IRealmBrowserProps {
  classes: Realm.ObjectSchema[];
  contentKey: string;
  contentRef: (instance: Content | null) => void;
  createObjectSchema?: Realm.ObjectSchema;
  dataVersion: number;
  dataVersionAtBeginning?: number;
  allowCreate: boolean;
  editMode: EditMode;
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  importDialog: null | { filePaths: string[]; classNames: string[] };
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isAddSubscriptionOpen: boolean;
  isClassNameAvailable: (name: string) => boolean;
  isEncryptionDialogVisible: boolean;
  isLeftSidebarOpen: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  jsonViewerDialog: null | { value: unknown };
  onAddClass: (schema: Realm.ObjectSchema) => void;
  onAddProperty: (name: string, type: Realm.PropertyType) => void;
  onAddSubscription: (schemaName: string, query: string) => void;
  onCancelTransaction: () => void;
  onClassFocussed: ClassFocussedHandler;
  onCommitTransaction: () => void;
  onHideEncryptionDialog: () => void;
  onHideImportDialog: () => void;
  onImport: (format: ImportFormat, files: ImportableFile[]) => void;
  onShowJsonViewerDialog: JsonViewerDialogExecutor;
  onHideJsonViewerDialog: () => void;
  onLeftSidebarToggle: () => void;
  onListFocussed: ListFocussedHandler;
  onSingleListFocussed: SingleListFocussedHandler;
  onOpenWithEncryption: (key: string) => void;
  onRealmChanged: () => void;
  progress: ILoadingProgress;
  realm?: Realm;
  toggleAddClass: () => void;
  toggleAddClassProperty: () => void;
  toggleAddSubscription: () => void;
  validateQuery: (schemaName: string, queryString: string) => string | null;
  isEmbeddedType: IsEmbeddedTypeChecker;
}

export const RealmBrowser = ({
  classes,
  contentKey,
  contentRef,
  dataVersion,
  dataVersionAtBeginning,
  allowCreate,
  editMode,
  focus,
  getClassFocus,
  getSchemaLength,
  importDialog,
  isAddClassOpen,
  isAddPropertyOpen,
  isAddSubscriptionOpen,
  isClassNameAvailable,
  isEncryptionDialogVisible,
  isLeftSidebarOpen,
  isPropertyNameAvailable,
  jsonViewerDialog,
  onAddClass,
  onAddProperty,
  onAddSubscription,
  onCancelTransaction,
  onClassFocussed,
  onCommitTransaction,
  onHideEncryptionDialog,
  onHideImportDialog,
  onImport,
  onShowJsonViewerDialog,
  onHideJsonViewerDialog,
  onLeftSidebarToggle,
  onListFocussed,
  onSingleListFocussed,
  onOpenWithEncryption,
  onRealmChanged,
  progress,
  realm,
  toggleAddClass,
  toggleAddClassProperty,
  toggleAddSubscription,
  validateQuery,
  isEmbeddedType,
}: IRealmBrowserProps) => {
  const focussedClassMissingSubscriptions =
    focus?.kind === 'class' &&
    realm?.syncSession?.config.flexible &&
    ![...realm.subscriptions].some(sub => sub.objectType === focus.className);
  return (
    <div className="RealmBrowser">
      <LeftSidebar
        classes={classes}
        className="RealmBrowser__LeftSidebar"
        focus={focus}
        getSchemaLength={getSchemaLength}
        isOpen={isLeftSidebarOpen}
        onClassFocussed={onClassFocussed}
        onToggle={onLeftSidebarToggle}
        progress={progress}
        readOnly={editMode === EditMode.Disabled}
        subscriptions={
          realm?.syncSession?.config.flexible ? realm.subscriptions : undefined
        }
        toggleAddClass={toggleAddClass}
        toggleAddSubscription={toggleAddSubscription}
      />

      <div className="RealmBrowser__Wrapper">
        {focussedClassMissingSubscriptions ? (
          <NoSubscriptionsPlaceholder />
        ) : focus && realm ? (
          <Content
            dataVersion={dataVersion}
            dataVersionAtBeginning={dataVersionAtBeginning}
            allowCreate={allowCreate}
            editMode={editMode}
            focus={focus}
            getClassFocus={getClassFocus}
            highlightMode={HighlightMode.Multiple}
            key={contentKey}
            onAddColumnClick={toggleAddClassProperty}
            onCancelTransaction={onCancelTransaction}
            onClassFocussed={onClassFocussed}
            onCommitTransaction={onCommitTransaction}
            onListFocussed={onListFocussed}
            onSingleListFocussed={onSingleListFocussed}
            onRealmChanged={onRealmChanged}
            onShowJsonViewerDialog={onShowJsonViewerDialog}
            permissionSidebar={true}
            progress={progress}
            readOnly={editMode === EditMode.Disabled}
            realm={realm}
            ref={contentRef}
            isEmbeddedType={isEmbeddedType}
          />
        ) : (
          // TODO: Use the loading overlay until Realm has fully loaded
          <NoFocusPlaceholder />
        )}
        {focus && focus.kind === 'class' && focus.isEmbedded && (
          <EmbeddedFocusPlaceholder />
        )}
      </div>

      <AddClassModal
        isOpen={isAddClassOpen}
        isClassNameAvailable={isClassNameAvailable}
        onAddClass={onAddClass}
        toggle={toggleAddClass}
      />

      {focus && focus.kind === 'class' ? (
        <AddPropertyModal
          focus={focus}
          isOpen={isAddPropertyOpen}
          isPropertyNameAvailable={isPropertyNameAvailable}
          onAddProperty={onAddProperty}
          classes={classes}
          toggle={toggleAddClassProperty}
        />
      ) : null}

      {focus && focus.kind === 'class' ? (
        <AddSubscriptionModal
          schemaName={focus.className}
          isOpen={isAddSubscriptionOpen}
          onAddSubscription={onAddSubscription}
          validateQuery={validateQuery}
          toggle={toggleAddSubscription}
        />
      ) : null}

      <EncryptionDialog
        onHide={onHideEncryptionDialog}
        onOpenWithEncryption={onOpenWithEncryption}
        visible={isEncryptionDialogVisible}
      />

      <ImportDialog
        filePaths={importDialog ? importDialog.filePaths : []}
        classNames={importDialog ? importDialog.classNames : []}
        visible={importDialog !== null}
        onHide={onHideImportDialog}
        onImport={onImport}
      />

      <JsonViewerDialog
        value={jsonViewerDialog?.value}
        visible={jsonViewerDialog !== null}
        onHide={onHideJsonViewerDialog}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
