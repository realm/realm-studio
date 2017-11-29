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

export const SchemaModal = ({
  isOpen,
  toggle,
  onNameChange,
  onSubmit,
  name,
}: {
  isOpen: boolean;
  toggle: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  name: string;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>Create a new schema</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Schema name</Label>
            <Input
              name="name"
              id="name"
              type="text"
              required={true}
              value={name}
              onChange={onNameChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Create schema</Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
