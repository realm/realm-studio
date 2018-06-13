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
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { Content } from '..';
import { EditMode } from '../..';
import { IClassFocus } from '../../focus';
import { CellClickHandler, IHighlight } from '../Table';

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
  highlight?: IHighlight;
  isOpen: true;
  isOptional: boolean;
  onCellClick: CellClickHandler;
  selectedObject: Realm.Object | null;
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
      Select a new {props.isOpen ? props.focus.className : 'object'}
    </ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      {props.isOpen ? (
        <Content
          editMode={EditMode.Disabled}
          focus={props.focus}
          onCellClick={props.onCellClick}
          readOnly={true}
          ref={props.contentRef}
        />
      ) : null}
    </ModalBody>
    <ModalFooter>
      {props.isOpen &&
        !props.selectedObject &&
        props.isOptional && (
          <Button color="primary" onClick={onSelect}>
            Set to null
          </Button>
        )}
      <Button color="primary" onClick={onSelect}>
        Select
      </Button>
      <Button color="secondary" onClick={onCancel}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
);
