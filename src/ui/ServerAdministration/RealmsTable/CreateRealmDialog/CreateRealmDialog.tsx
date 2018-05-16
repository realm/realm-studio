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
