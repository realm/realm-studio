import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

export interface IEncryptionDialogProps {
  onExit: () => void;
  onKeyChange: (key: string) => void;
  onSubmit: (e: React.FormEvent<any>) => void;
  visible: boolean;
}

export const EncryptionDialog = ({
  onExit,
  onKeyChange,
  onSubmit,
  visible,
}: IEncryptionDialogProps) => (
  <Modal isOpen={visible} onExit={onExit}>
    <Form onSubmit={onSubmit}>
      <ModalHeader>The Realm might be encrypted</ModalHeader>
      <ModalBody>
        <p>Either this is not a Realm file or it's encrypted.</p>
        <Input
          onChange={e => {
            onKeyChange(e.target.value);
          }}
          pattern="[a-fA-F0-9]{128}"
          placeholder="128-character hex-encoded encryption key"
          required={true}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onExit}>
          Cancel
        </Button>
        <Button color="primary">Try again</Button>
      </ModalFooter>
    </Form>
  </Modal>
);
