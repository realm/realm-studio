////////////////////////////////////////////////////////////////////////////
//
// Copyright 2021 Realm Inc.
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
import {
  Button,
  CardBody,
  CardText,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

export interface IJSonViewerDialogProps {
  onCancel: () => void;
  visible: boolean;
  json: string;
}

export const JsonViewerDialog = ({
  onCancel,
  visible,
  json,
}: IJSonViewerDialogProps) => (
  <Modal isOpen={visible} toggle={onCancel}>
    <Form>
      <ModalHeader>JSON Viewer</ModalHeader>
      {json.includes('"$refId":') && (
        <CardBody style={{ borderBottom: '1px solid #dee2e6' }}>
          <CardText>
            <small>
              {
                '"$refId" & "$ref" has been added to the serialized output, to resolve circular structures.'
              }
            </small>
          </CardText>
        </CardBody>
      )}
      <ModalBody>
        <pre>{json}</pre>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onCancel}>Close</Button>
      </ModalFooter>
    </Form>
  </Modal>
);
