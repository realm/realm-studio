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
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import { IClassFocus } from '../focus';
import { ITypeOption } from './';

export const View = ({
  focus,
  isList,
  isOpen,
  primitiveTypeSelected,
  name,
  nameIsValid,
  onIsListChange,
  onNameChange,
  onOptionalChange,
  onSubmit,
  onTypeChange,
  optional,
  toggle,
  type,
  typeOptions,
}: {
  focus: IClassFocus;
  isList: boolean;
  isOpen: boolean;
  primitiveTypeSelected: boolean;
  name: string;
  nameIsValid: boolean;
  onIsListChange: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionalChange: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional: boolean;
  toggle: () => void;
  type: string;
  typeOptions: ITypeOption[];
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Add new property to {focus.className}
        </ModalHeader>
        <ModalBody>
          <FormGroup className={nameIsValid ? '' : 'has-danger'}>
            <Label for="name">Name</Label>
            <Input
              name="name"
              id="name"
              type="text"
              required={true}
              value={name}
              onChange={onNameChange}
            />
            {!nameIsValid && (
              <FormFeedback>
                Already exists a property with that name in the schema.
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              type="select"
              name="type"
              id="type"
              value={type}
              onChange={onTypeChange}
            >
              {typeOptions.map(
                (option, index) =>
                  option.show && (
                    <option
                      key={index}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.value}
                    </option>
                  ),
              )}
            </Input>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="isList"
                checked={isList}
                onChange={onIsListChange}
              />{' '}
              Make this a list of {type}s
            </Label>
          </FormGroup>
          <FormGroup
            check
            style={{
              visibility:
                !primitiveTypeSelected && isList ? 'hidden' : 'visible',
            }}
          >
            <Label check>
              <Input
                type="checkbox"
                name="optional"
                checked={optional}
                onChange={onOptionalChange}
              />{' '}
              {isList
                ? 'Optional: Allow null values in the list'
                : 'Optional: Allow a null value'}
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!nameIsValid}>
            Add property
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
