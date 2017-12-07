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
  onTypeChange,
  onOptionalChange,
  onSubmit,
  name,
  nameIsValid,
  type,
  optional,
  typeOptions,
  isList,
  onIsListChange,
}: {
  isOpen: boolean;
  toggle: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionalChange: () => void;
  onIsListChange: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  name: string;
  nameIsValid: boolean;
  type: string;
  optional: boolean;
  isList: boolean;
  typeOptions: string[];
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Add new property to the schema
        </ModalHeader>
        <ModalBody>
          <FormGroup className={nameIsValid ? '' : 'has-danger'}>
            <Label for="name">Property name</Label>
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
                Already exists a property with that name in the schema.
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              type="select"
              name="type"
              id="type"
              value={type}
              onChange={onTypeChange}
            >
              {typeOptions.map(option => (
                <option key={option}>{option}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="isList"
                checked={isList}
                onChange={onIsListChange}
              />{' '}
              It's a list
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="optional"
                checked={optional}
                onChange={onOptionalChange}
              />{' '}
              Optional
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!nameIsValid}>
            Add property name
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
