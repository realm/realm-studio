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
import Realm from 'realm';

import { IClassFocus } from '../../focus';

import { PropertyRow } from './PropertyRow';
import { IsEmbeddedTypeChecker, JsonViewerDialogExecutor } from '../..';

interface IBaseCreateObjectDialogProps {
  generateInitialValue: (property: Realm.ObjectSchemaProperty) => any;
  onCancel: () => void;
  onCreate: () => void;
  onValueChange: (propertyName: string, value: any) => void;
  values: { [propertyName: string]: any };
}

export interface IClosedCreateObjectDialogProps
  extends IBaseCreateObjectDialogProps {
  isOpen: false;
}

export interface IOpenCreateObjectDialogProps
  extends IBaseCreateObjectDialogProps {
  getClassFocus: (className: string) => IClassFocus;
  isOpen: true;
  schema: Realm.ObjectSchema;
  isEmbeddedType: IsEmbeddedTypeChecker;
  onShowJsonViewerDialog: JsonViewerDialogExecutor;
}

export type ICreateObjectDialogProps =
  | IClosedCreateObjectDialogProps
  | IOpenCreateObjectDialogProps;

export const CreateObjectDialog = ({
  generateInitialValue,
  onCancel,
  onCreate,
  onValueChange,
  values,
  ...props
}: ICreateObjectDialogProps) => (
  <Modal isOpen={props.isOpen} toggle={onCancel} size="lg">
    <ModalHeader toggle={onCancel}>
      Create {props.isOpen ? props.schema.name : 'object'}
    </ModalHeader>
    <ModalBody>
      {props.isOpen
        ? Object.keys(props.schema.properties).map(propertyName => (
            <PropertyRow
              generateInitialValue={generateInitialValue}
              getClassFocus={props.getClassFocus}
              isPrimary={props.schema.primaryKey === propertyName}
              key={propertyName}
              onValueChange={value => onValueChange(propertyName, value)}
              property={
                props.schema.properties[
                  propertyName
                ] as Realm.ObjectSchemaProperty
              }
              propertyName={propertyName}
              value={values[propertyName]}
              isEmbeddedType={props.isEmbeddedType}
              onShowJsonViewerDialog={props.onShowJsonViewerDialog}
            />
          ))
        : null}
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={onCancel}>
        Cancel
      </Button>{' '}
      <Button color="primary" onClick={onCreate}>
        Create
      </Button>
    </ModalFooter>
  </Modal>
);
