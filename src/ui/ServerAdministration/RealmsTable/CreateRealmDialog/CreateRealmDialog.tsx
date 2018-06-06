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
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

export const CreateRealmDialog = ({
  isOpen,
  toggle,
  onPathChanged,
  onSubmit,
  path,
}: {
  isOpen: boolean;
  toggle: () => void;
  onPathChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  path: string;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>Create a new Realm</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="username">Path on the server</Label>
            <Input
              name="path"
              id="path"
              type="text"
              required={true}
              value={path}
              onChange={onPathChanged}
            />
            <small>~ will be replaced by your user id</small>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Create Realm</Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
