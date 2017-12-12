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

import { IClassFocus } from '../focus';

export const View = ({
  focus,
  isList,
  isOpen,
  name,
  nameIsValid,
  onIsListChange,
  onNameChange,
  onOptionalChange,
  onSubmit,
  onTypeChange,
  optional,
  toggle,
  type,
  typeOptions,
}: {
  focus: IClassFocus;
  isList: boolean;
  isOpen: boolean;
  name: string;
  nameIsValid: boolean;
  onIsListChange: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionalChange: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional: boolean;
  toggle: () => void;
  type: string;
  typeOptions: string[];
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Add new property to {focus.className}
        </ModalHeader>
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
              Make this a list of {type}s
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
            Add property
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
