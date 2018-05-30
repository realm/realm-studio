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

export const CreateUserDialog = ({
  isOpen,
  onToggle,
  onPasswordChanged,
  onPasswordRepeatedChanged,
  onUsernameChanged,
  onSubmit,
  password,
  passwordRepeated,
  username,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordRepeatedChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  password: string;
  passwordRepeated: string;
  username: string;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={onToggle}>Create a new user</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              name="username"
              id="username"
              type="text"
              required
              value={username}
              onChange={onUsernameChanged}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              name="password"
              id="password"
              type="password"
              required
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
              required
              valid={passwordRepeated !== '' && password === passwordRepeated}
              invalid={password !== passwordRepeated}
              value={passwordRepeated}
              onChange={onPasswordRepeatedChanged}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Create user</Button>{' '}
          <Button color="secondary" onClick={onToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
