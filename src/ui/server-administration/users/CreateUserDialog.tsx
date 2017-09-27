import * as React from "react";
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
} from "reactstrap";

import { IUser } from "../../../services/ros";

export const CreateUserDialog = ({
  isOpen,
  toggle,
  onPasswordChanged,
  onPasswordRepeatedChanged,
  onUsernameChanged,
  onSubmit,
  password,
  passwordRepeated,
  username,
}: {
  isOpen: boolean,
  toggle: () => void,
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPasswordRepeatedChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  password: string,
  passwordRepeated: string,
  username: string,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Create a new user
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              name="username"
              id="username"
              type="text"
              required={true}
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
              required={true}
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
              required={true}
              value={passwordRepeated}
              onChange={onPasswordRepeatedChanged}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Create user</Button>{" "}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
