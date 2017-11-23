import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as Realm from 'realm';

import { PropertyRow } from './PropertyRow';

export interface ICreateObjectDialogProps {
  schema?: Realm.ObjectSchema;
  isOpen: boolean;
  onCreate: () => void;
  onValueChange: (propertyName: string, value: any) => void;
  toggle: () => void;
  values: { [propertyName: string]: any };
}

export const CreateObjectDialog = ({
  schema,
  isOpen,
  onCreate,
  onValueChange,
  toggle,
  values,
}: ICreateObjectDialogProps) =>
  schema ? (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create {schema.name}</ModalHeader>
      <ModalBody>
        {Object.keys(schema.properties).map(propertyName => (
          <PropertyRow
            isPrimary={schema.primaryKey === propertyName}
            key={propertyName}
            value={values[propertyName]}
            onValueChange={value => onValueChange(propertyName, value)}
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
        <Button color="primary" onClick={toggle}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  ) : null;
