import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { IPropertyWithName } from '..';
import { ContentContainer } from '../ContentContainer';
import { IClassFocus } from '../focus';
import { CellClickHandler, IHighlight } from '../table';

export interface IObjectSelectorStateProps {
  focus: IClassFocus;
  status: boolean;
}

export interface IObjectSelectorProps extends IObjectSelectorStateProps {
  close: () => void;
  highlight?: IHighlight;
  onCellClick: CellClickHandler;
  onSelectObject: () => void;
  property: IPropertyWithName;
  selectedObject: Realm.Object | null;
}

export const ObjectSelector = ({
  close,
  focus,
  highlight,
  onCellClick,
  onSelectObject,
  property,
  selectedObject,
  status,
}: IObjectSelectorProps) => (
  <Modal size="lg" isOpen={status} toggle={close} className="ConfirmModal">
    <ModalHeader toggle={close}>Select a new {focus.className}</ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      <ContentContainer
        focus={focus}
        highlight={highlight}
        onCellClick={onCellClick}
      />
    </ModalBody>
    <ModalFooter>
      {!selectedObject &&
        property.optional && (
          <Button color="primary" onClick={onSelectObject}>
            Set to null
          </Button>
        )}
      {selectedObject && (
        <Button color="primary" onClick={onSelectObject}>
          Set
        </Button>
      )}
      <Button color="secondary" onClick={close}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
);
