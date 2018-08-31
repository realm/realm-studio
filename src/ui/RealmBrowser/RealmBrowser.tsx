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
import * as Realm from 'realm';

import { ILoadingProgress, LoadingOverlay } from '../reusable/LoadingOverlay';

import { ClassFocussedHandler, ListFocussedHandler } from '.';
import { AddClassModal } from './AddClassModal';
import { AddPropertyModal } from './AddPropertyModal';
import { Content, EditMode, HighlightMode } from './Content';
import { EncryptionDialog } from './EncryptionDialog';
import { Focus, IClassFocus } from './focus';
import { LeftSidebar } from './LeftSidebar';
import { NoFocusPlaceholder } from './NoFocusPlaceholder';

import './RealmBrowser.scss';

export interface IRealmBrowserProps {
  contentKey: string;
  contentRef: (instance: Content | null) => void;
  createObjectSchema?: Realm.ObjectSchema;
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isClassNameAvailable: (name: string) => boolean;
  isEncryptionDialogVisible: boolean;
  isLeftSidebarOpen: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  onAddProperty: (name: string, type: Realm.PropertyType) => void;
  onCancelTransaction: () => void;
  onClassFocussed: ClassFocussedHandler;
  onCommitTransaction: () => void;
  onHideEncryptionDialog: () => void;
  onLeftSidebarToggle: () => void;
  onListFocussed: ListFocussedHandler;
  onOpenWithEncryption: (key: string) => void;
  onRealmChanged: () => void;
  progress: ILoadingProgress;
  realm?: Realm;
  schemas: Realm.ObjectSchema[];
  toggleAddSchema: () => void;
  toggleAddSchemaProperty: () => void;
}

export const RealmBrowser = ({
  contentKey,
  contentRef,
  dataVersion,
  dataVersionAtBeginning,
  editMode,
  focus,
  getClassFocus,
  getSchemaLength,
  isAddClassOpen,
  isAddPropertyOpen,
  isClassNameAvailable,
  isEncryptionDialogVisible,
  isLeftSidebarOpen,
  isPropertyNameAvailable,
  onAddClass,
  onAddProperty,
  onCancelTransaction,
  onClassFocussed,
  onCommitTransaction,
  onHideEncryptionDialog,
  onLeftSidebarToggle,
  onListFocussed,
  onOpenWithEncryption,
  onRealmChanged,
  progress,
  realm,
  schemas,
  toggleAddSchema,
  toggleAddSchemaProperty,
}: IRealmBrowserProps) => {
  return (
    <div className="RealmBrowser">
      <LeftSidebar
        className="RealmBrowser__LeftSidebar"
        focus={focus}
        getSchemaLength={getSchemaLength}
        isOpen={isLeftSidebarOpen}
        onClassFocussed={onClassFocussed}
        onToggle={onLeftSidebarToggle}
        progress={progress}
        schemas={schemas}
        toggleAddSchema={toggleAddSchema}
      />
      <div className="RealmBrowser__Wrapper">
        {focus && realm ? (
          <Content
            dataVersion={dataVersion}
            dataVersionAtBeginning={dataVersionAtBeginning}
            editMode={editMode}
            highlightMode={HighlightMode.Multiple}
            focus={focus}
            getClassFocus={getClassFocus}
            key={contentKey}
            onAddColumnClick={toggleAddSchemaProperty}
            onCancelTransaction={onCancelTransaction}
            onClassFocussed={onClassFocussed}
            onCommitTransaction={onCommitTransaction}
            onListFocussed={onListFocussed}
            onRealmChanged={onRealmChanged}
            progress={progress}
            readOnly={false}
            realm={realm}
            ref={contentRef}
          />
        ) : (
          // TODO: Use the loading overlay until Realm has fully loaded
          <NoFocusPlaceholder />
        )}
      </div>

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

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
