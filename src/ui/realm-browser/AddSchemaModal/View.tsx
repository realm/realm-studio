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

export const View = ({
  isOpen,
  toggle,
  onNameChange,
  onSubmit,
  name,
  nameIsValid,
}: {
  isOpen: boolean;
  toggle: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  name: string;
  nameIsValid: boolean;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>Create a new class</ModalHeader>
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
                Already exists a class with that name.
              </FormFeedback>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!nameIsValid}>
            Create class
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
