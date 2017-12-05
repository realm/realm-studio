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
  onPropertyNameChange,
  onSubmit,
  propertyName,
  propertyNameIsValid,
}: {
  isOpen: boolean;
  toggle: () => void;
  onPropertyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  propertyName: string;
  propertyNameIsValid: boolean;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Add new property to the schema
        </ModalHeader>
        <ModalBody>
          <FormGroup className={propertyNameIsValid ? '' : 'has-danger'}>
            <Label for="propertyName">Property name</Label>
            <Input
              name="propertyName"
              id="propertyName"
              type="text"
              required={true}
              value={propertyName}
              onChange={onPropertyNameChange}
            />
            {!propertyNameIsValid && (
              <FormFeedback>
                Already exists a property with name in the schema.
              </FormFeedback>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!propertyNameIsValid}>
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
