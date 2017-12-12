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

export const UploadRealmDialog = ({
  isOpen,
  localPath,
  onLocalPathChanged,
  onServerPathChanged,
  onSubmit,
  serverPath,
  toggle,
}: {
  isOpen: boolean;
  localPath: string;
  onLocalPathChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onServerPathChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  serverPath: string;
  toggle: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>Upload Realm</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="localPath">Select a local file</Label>
            <Input
              name="localPath"
              id="localPath"
              type="file"
              required={true}
              onChange={onLocalPathChanged}
            />
          </FormGroup>
          <FormGroup>
            <Label for="serverPath">Path on the server</Label>
            <Input
              name="serverPath"
              id="serverPath"
              type="text"
              required={true}
              value={serverPath}
              onChange={onServerPathChanged}
            />
            <small>~ will be replaced by your user id</small>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Upload Realm</Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
