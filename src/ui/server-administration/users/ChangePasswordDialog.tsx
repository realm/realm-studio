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

export const ChangePasswordDialog = ({
  isOpen,
  toggle,
  onPasswordChanged,
  onPasswordRepeatedChanged,
  onSubmit,
  password,
  passwordRepeated,
  user,
}: {
  isOpen: boolean,
  toggle: () => void,
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPasswordRepeatedChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  password: string,
  passwordRepeated: string,
  user: IUser,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Change password
        </ModalHeader>
        <ModalBody>
          <p>Enter the new password for {user.userId}.</p>
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
          <Button color="primary">Change password</Button>{" "}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
