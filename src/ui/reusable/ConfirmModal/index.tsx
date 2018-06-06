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

export interface IConfirmModal {
  status: boolean;
  title: string;
  description: string;
  yes: () => any;
  no: () => any;
}

export const ConfirmModal = ({
  status,
  title,
  description,
  yes,
  no,
}: {
  status: boolean;
  title: string;
  description: string;
  yes: () => any;
  no: () => any;
}) => (
  <Modal isOpen={status} toggle={no} className="ConfirmModal">
    <ModalHeader toggle={no}>{title}</ModalHeader>
    <ModalBody>{description}</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={yes}>
        Yes
      </Button>
      <Button color="secondary" onClick={no}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);
