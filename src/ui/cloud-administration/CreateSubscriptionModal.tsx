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

import { ILocation } from '../../services/raas';

export const CreateSubscriptionModal = ({
  id,
  isOpen,
  locations,
  onCreateSubscription,
  onIdChange,
  onPasswordChange,
  onLocationChange,
  onToggle,
  password,
  selectedLocationId,
}: {
  id: string;
  isOpen: boolean;
  locations: ILocation[];
  onCreateSubscription: () => void;
  onIdChange: (id: string) => void;
  onPasswordChange: (password: string) => void;
  onLocationChange: (shardId: string) => void;
  onToggle: () => void;
  password: string;
  selectedLocationId?: string;
}) => (
  <Modal isOpen={isOpen}>
    <Form
      onSubmit={e => {
        e.preventDefault();
        onCreateSubscription();
        onToggle();
      }}
    >
      <ModalHeader toggle={onToggle}>
        Start a new Realm Object Server
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="createSubscriptionId">
            Id (lowercase without spaces)
          </Label>
          <Input
            id="createSubscriptionId"
            pattern="[a-z0-9\-]+"
            value={id}
            onChange={e => {
              onIdChange(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="createSubscriptionLocation">Location</Label>
          <Input
            id="createSubscriptionLocation"
            name="select"
            onChange={e => {
              onLocationChange(e.target.value);
            }}
            type="select"
            defaultValue={selectedLocationId}
          >
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="createSubscriptionPassword">Initial admin password</Label>
          <Input
            id="createSubscriptionPassword"
            type="password"
            value={password}
            onChange={e => {
              onPasswordChange(e.target.value);
            }}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Start</Button>{' '}
        <Button
          color="secondary"
          onClick={e => {
            e.preventDefault();
            onToggle();
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Form>
  </Modal>
);
