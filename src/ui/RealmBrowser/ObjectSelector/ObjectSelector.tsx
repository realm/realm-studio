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

import { EditMode } from '..';
import { Content } from '../Content';
import { CellClickHandler, IHighlight } from '../Content/Table';
import { IClassFocus } from '../focus';

export interface IObjectSelectorStateProps {
  focus: IClassFocus;
  isOpen: boolean;
}

export interface IObjectSelectorProps extends IObjectSelectorStateProps {
  highlight?: IHighlight;
  isOptional: boolean;
  onCellClick: CellClickHandler;
  onResetHighlight: () => void;
  onSelectObject: () => void;
  selectedObject: Realm.Object | null;
  toggle: () => void;
}

export const ObjectSelector = ({
  focus,
  highlight,
  isOpen,
  isOptional,
  onCellClick,
  onResetHighlight,
  onSelectObject,
  selectedObject,
  toggle,
}: IObjectSelectorProps) => (
  <Modal size="lg" isOpen={isOpen} toggle={toggle} className="ConfirmModal">
    <ModalHeader toggle={toggle}>Select a new {focus.className}</ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      <Content
        editMode={EditMode.Disabled}
        onResetHighlight={onResetHighlight}
        focus={focus}
        highlight={highlight}
        onCellClick={onCellClick}
      />
    </ModalBody>
    <ModalFooter>
      {!selectedObject &&
        isOptional && (
          <Button color="primary" onClick={onSelectObject}>
            Set to null
          </Button>
        )}
      {selectedObject && (
        <Button color="primary" onClick={onSelectObject}>
          Select
        </Button>
      )}
      <Button color="secondary" onClick={toggle}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
);
