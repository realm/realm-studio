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
import * as Realm from 'realm';

import { IClassFocus } from '../focus';

import { PropertyRow } from './PropertyRow';

export interface ICreateObjectDialogProps {
  generateInitialValue: (property: Realm.ObjectSchemaProperty) => any;
  getClassFocus: (className: string) => IClassFocus;
  isOpen: boolean;
  onCreate: () => void;
  onValueChange: (propertyName: string, value: any) => void;
  schema?: Realm.ObjectSchema;
  toggle: () => void;
  values: { [propertyName: string]: any };
}

export const CreateObjectDialog = ({
  getClassFocus,
  generateInitialValue,
  isOpen,
  onCreate,
  onValueChange,
  schema,
  toggle,
  values,
}: ICreateObjectDialogProps) =>
  schema ? (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Create {schema.name}</ModalHeader>
      <ModalBody>
        {Object.keys(schema.properties).map(propertyName => (
          <PropertyRow
            generateInitialValue={generateInitialValue}
            getClassFocus={getClassFocus}
            isPrimary={schema.primaryKey === propertyName}
            key={propertyName}
            onValueChange={value => onValueChange(propertyName, value)}
            property={
              schema.properties[propertyName] as Realm.ObjectSchemaProperty
            }
            propertyName={propertyName}
            value={values[propertyName]}
          />
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>{' '}
        <Button color="primary" onClick={onCreate}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  ) : null;
