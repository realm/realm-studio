import * as React from 'react';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { PRIMARY_KEY_OPTIONS } from './';

export const View = ({
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
  onPKChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPKNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPKTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  name: string;
  nameIsValid: boolean;
  primaryKey: string;
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
          <FormGroup>
            <Label for="name">Primary key</Label>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="primaryKey"
                  value={PRIMARY_KEY_OPTIONS.none.key}
                  checked={primaryKey === PRIMARY_KEY_OPTIONS.none.key}
                  onChange={onPKChange}
                />
                <span>{PRIMARY_KEY_OPTIONS.none.label}</span>
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="primaryKey"
                  value={PRIMARY_KEY_OPTIONS.auto.key}
                  checked={primaryKey === PRIMARY_KEY_OPTIONS.auto.key}
                  onChange={onPKChange}
                />
                <span>{PRIMARY_KEY_OPTIONS.auto.label}</span>
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="primaryKey"
                  value={PRIMARY_KEY_OPTIONS.custom.key}
                  checked={primaryKey === PRIMARY_KEY_OPTIONS.custom.key}
                  onChange={onPKChange}
                />
                <span>{PRIMARY_KEY_OPTIONS.custom.label}</span>
              </Label>
            </FormGroup>
          </FormGroup>
          {primaryKey === PRIMARY_KEY_OPTIONS.custom.key && (
            <Row>
              <Col sm={1} />
              <Col sm={11}>
                <FormGroup>
                  <Label for="primaryKeyName">Name</Label>
                  <Input
                    name="primaryKeyName"
                    type="text"
                    required={true}
                    value={primaryKeyName}
                    onChange={onPKNameChange}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col sm={2}>
                    <Label for="name">Type:</Label>
                  </Col>
                  <Col sm={2}>
                    <Label>
                      <Input
                        type="radio"
                        name="primaryKeyType"
                        value="int"
                        checked={primaryKeyType === 'int'}
                        onChange={onPKTypeChange}
                      />
                      <span>int</span>
                    </Label>
                  </Col>
                  <Col sm={2}>
                    <Label>
                      <Input
                        type="radio"
                        name="primaryKeyType"
                        value="string"
                        checked={primaryKeyType === 'string'}
                        onChange={onPKTypeChange}
                      />
                      <span>string</span>
                    </Label>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          )}
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
