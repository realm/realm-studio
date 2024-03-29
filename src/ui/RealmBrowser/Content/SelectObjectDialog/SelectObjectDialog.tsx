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
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { Content, EditMode, HighlightMode } from '..';
import { IClassFocus } from '../../focus';
import { IHighlight } from '../Table';
import { IsEmbeddedTypeChecker, JsonViewerDialogExecutor } from '../..';

interface IBaseSelectObjectDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onSelect: () => void;
}

interface IClosedSelectObjectDialogProps extends IBaseSelectObjectDialogProps {
  isOpen: false;
}

interface IOpenSelectObjectDialogProps extends IBaseSelectObjectDialogProps {
  contentRef: (instance: Content | null) => void;
  focus: IClassFocus;
  selection: Realm.Object[];
  isOpen: true;
  isOptional: boolean;
  onDeselect: () => void;
  onHighlightChange: (
    highlight: IHighlight | undefined,
    collection: Realm.OrderedCollection<any>,
  ) => void;
  multiple: boolean;
  isEmbeddedType: IsEmbeddedTypeChecker;
  onShowJsonViewerDialog: JsonViewerDialogExecutor;
}

export type ISelectObjectDialogProps =
  | IClosedSelectObjectDialogProps
  | IOpenSelectObjectDialogProps;

export const SelectObjectDialog = ({
  onCancel,
  onSelect,
  ...props
}: ISelectObjectDialogProps): React.ReactElement<ISelectObjectDialogProps> => (
  <Modal
    size="lg"
    isOpen={props.isOpen}
    toggle={onCancel}
    className="ConfirmModal"
  >
    <ModalHeader toggle={onCancel}>
      Select a {props.isOpen ? props.focus.className : 'object'}
    </ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      {props.isOpen ? (
        <Content
          editMode={EditMode.Disabled}
          allowCreate={false}
          highlightMode={
            props.multiple ? HighlightMode.Multiple : HighlightMode.Single
          }
          focus={props.focus}
          onHighlightChange={props.onHighlightChange}
          readOnly={true}
          ref={props.contentRef}
          isEmbeddedType={props.isEmbeddedType}
          onShowJsonViewerDialog={props.onShowJsonViewerDialog}
        />
      ) : null}
    </ModalBody>
    <ModalFooter>
      {props.isOpen && props.selection.length > 0 && props.isOptional && (
        <Button color="primary" onClick={props.onDeselect}>
          Remove selection
        </Button>
      )}
      <Button color="primary" onClick={onSelect}>
        {props.isOpen && props.selection.length > 0 ? 'Select' : 'Select null'}
      </Button>
      <Button color="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);
