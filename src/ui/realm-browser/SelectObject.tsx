import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ContentContainer } from './ContentContainer';

export interface IProps {
  status: boolean;
  schema: Realm.ObjectSchema;
  data: Realm.Results<any> | any;
  close: () => void;
  schemaName: string;
  updateReference: (object: any) => void;
  optional: boolean;
}

export const SelectObject = ({
  status,
  schema,
  data,
  close,
  updateReference,
  schemaName,
  optional,
}: IProps) => (
  <Modal size="lg" isOpen={status} toggle={close} className="ConfirmModal">
    <ModalHeader toggle={close}>Select a new {schemaName}</ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      {data &&
        schema && (
          <ContentContainer
            schema={schema}
            data={data}
            onRowClick={updateReference}
            onListCellClick={updateReference}
          />
        )}
    </ModalBody>
    <ModalFooter>
      {optional && (
        <Button color="primary" onClick={() => updateReference(null)}>
          Set to null
        </Button>
      )}
      <Button color="secondary" onClick={close}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
);
