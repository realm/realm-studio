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

interface IClosedDeleteObjectsDialogProps {
  isOpen: false;
}

interface IOpenDeleteObjectsDialogProps {
  actionLabel: string;
  description: string;
  isOpen: true;
  onCancel: () => void;
  onDelete: () => void;
  title: string;
}

export type IDeleteObjectsDialogProps =
  | IClosedDeleteObjectsDialogProps
  | IOpenDeleteObjectsDialogProps;

export const DeleteObjectsDialog = (props: IDeleteObjectsDialogProps) => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.isOpen ? props.onCancel : undefined}
    className="ConfirmModal"
  >
    <ModalHeader toggle={props.isOpen ? props.onCancel : undefined}>
      {props.isOpen ? props.title : 'Deleting objects?'}
    </ModalHeader>
    <ModalBody>{props.isOpen ? props.description : null}</ModalBody>
    <ModalFooter>
      <Button
        color="secondary"
        onClick={props.isOpen ? props.onCancel : undefined}
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={props.isOpen ? props.onDelete : undefined}
      >
        {props.isOpen ? props.actionLabel : 'Delete'}
      </Button>
    </ModalFooter>
  </Modal>
);
