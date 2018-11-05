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

import { IUser } from '../../../../services/ros';

export const ChangePasswordDialog = ({
  isOpen,
  onToggle,
  onPasswordChanged,
  onPasswordRepeatedChanged,
  onSubmit,
  password,
  passwordRepeated,
  user,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordRepeatedChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  password: string;
  passwordRepeated: string;
  user: IUser;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={onToggle}>Change password</ModalHeader>
        <ModalBody>
          <p>Enter the new password for {user.userId}.</p>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password-repeated">Password (repeated)</Label>
            <Input
              name="password-repeated"
              id="password-repeated"
              type="password"
              valid={passwordRepeated !== '' && password === passwordRepeated}
              invalid={password !== passwordRepeated}
              value={passwordRepeated}
              onChange={onPasswordRepeatedChanged}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Change password</Button>{' '}
          <Button color="secondary" onClick={onToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
