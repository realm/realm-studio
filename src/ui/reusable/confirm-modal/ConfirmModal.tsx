import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export interface IProps {
  status: boolean;
  title: string;
  description: string;
  yes: () => any;
  no: () => any;
}

const ConfirmModal = ({
  status,
  title,
  description,
  yes,
  no,
}: {
  status: boolean;
  title: string;
  description: string;
  yes: () => any;
  no: () => any;
}) => (
  <Modal isOpen={status} toggle={no} className="ConfirmModal">
    <ModalHeader toggle={no}>{title}</ModalHeader>
    <ModalBody>{description}</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={yes}>
        Yes
      </Button>
      <Button color="secondary" onClick={no}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmModal;
