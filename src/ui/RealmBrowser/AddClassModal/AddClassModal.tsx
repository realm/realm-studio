import * as React from 'react';
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

export const AddClassModal = ({
  isOpen,
  toggle,
  onNameChange,
  onPKChange,
  onPKNameChange,
  onPKTypeChange,
  onSubmit,
  name,
  nameIsValid,
  primaryKey,
  primaryKeyName,
  primaryKeyType,
}: {
  isOpen: boolean;
  toggle: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPKChange: () => void;
  onPKNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPKTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  name: string;
  nameIsValid: boolean;
  primaryKey: boolean;
  primaryKeyName: string;
  primaryKeyType: string;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>Add a class to the schema</ModalHeader>
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
          <FormGroup className={nameIsValid ? '' : 'has-danger'}>
            <Label for="primaryKey">Primary key</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Input
                    addon
                    type="checkbox"
                    id="primaryKey"
                    name="primaryKey"
                    checked={primaryKey}
                    onChange={onPKChange}
                  />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="uuid"
                name="primaryKeyName"
                type="text"
                value={primaryKeyName}
                onChange={onPKNameChange}
                disabled={!primaryKey}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <Label check>
                    <Input
                      addon
                      type="radio"
                      name="primaryKeyType"
                      value="int"
                      checked={primaryKeyType === 'int'}
                      onChange={onPKTypeChange}
                      disabled={!primaryKey}
                    />{' '}
                    int
                  </Label>
                </InputGroupText>
                <InputGroupText>
                  <Label check>
                    <Input
                      addon
                      type="radio"
                      name="primaryKeyType"
                      value="string"
                      checked={primaryKeyType === 'string'}
                      onChange={onPKTypeChange}
                      disabled={!primaryKey}
                    />{' '}
                    string
                  </Label>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!nameIsValid}>
            Add class
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
