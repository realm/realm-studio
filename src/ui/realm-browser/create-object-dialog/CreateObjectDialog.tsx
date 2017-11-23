import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as Realm from 'realm';

import { IClassFocus } from '../focus';

import { PropertyRow } from './PropertyRow';

export interface ICreateObjectDialogProps {
  isOpen: boolean;
  onCreate: () => void;
  onValueChange: (propertyName: string, value: any) => void;
  getClassFocus: (className: string) => IClassFocus;
  schema?: Realm.ObjectSchema;
  toggle: () => void;
  values: { [propertyName: string]: any };
}

export const CreateObjectDialog = ({
  isOpen,
  onCreate,
  onValueChange,
  getClassFocus,
  schema,
  toggle,
  values,
}: ICreateObjectDialogProps) =>
  schema ? (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create {schema.name}</ModalHeader>
      <ModalBody>
        {Object.keys(schema.properties).map(propertyName => (
          <PropertyRow
            getClassFocus={getClassFocus}
            isPrimary={schema.primaryKey === propertyName}
            key={propertyName}
            onValueChange={value => onValueChange(propertyName, value)}
            value={values[propertyName]}
            property={
              schema.properties[propertyName] as Realm.ObjectSchemaProperty
            }
            propertyName={propertyName}
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
