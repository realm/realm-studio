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

import { IServiceShard } from '../../services/raas';

export const CreateTenantModal = ({
  id,
  isOpen,
  onCreateTenant,
  onIdChange,
  onPasswordChange,
  onShardChange,
  onToggle,
  password,
  selectedShardId,
  shards,
}: {
  id: string;
  isOpen: boolean;
  onCreateTenant: () => void;
  onIdChange: (id: string) => void;
  onPasswordChange: (password: string) => void;
  onShardChange: (shardId: string) => void;
  onToggle: () => void;
  password: string;
  selectedShardId?: string;
  shards: IServiceShard[];
}) => (
  <Modal isOpen={isOpen}>
    <Form
      onSubmit={e => {
        e.preventDefault();
        onCreateTenant();
        onToggle();
      }}
    >
      <ModalHeader toggle={onToggle}>
        Start a new Realm Object Server
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="createTenantId">Id (lowercase without spaces)</Label>
          <Input
            id="createTenantId"
            pattern="[a-z0-9\-]+"
            onChange={e => {
              onIdChange(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="createTenantShard">Location</Label>
          <Input
            id="createTenantShard"
            name="select"
            onChange={e => {
              onShardChange(e.target.value);
            }}
            type="select"
            defaultValue={selectedShardId}
          >
            {shards.map(shard => (
              <option key={shard.id} value={shard.id}>
                {shard.label}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="createTenantPassword">Initial admin password</Label>
          <Input
            id="createTenantPassword"
            type="password"
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
