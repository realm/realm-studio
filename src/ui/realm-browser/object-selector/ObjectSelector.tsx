import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { IPropertyWithName } from '..';
import { ContentContainer } from '../ContentContainer';
import { IClassFocus } from '../focus';
import { CellClickHandler, IHighlight } from '../table';

export interface IObjectSelectorStateProps {
  focus: IClassFocus;
  isOpen: boolean;
}

export interface IObjectSelectorProps extends IObjectSelectorStateProps {
  toggle: () => void;
  highlight?: IHighlight;
  isOptional: boolean;
  onCellClick: CellClickHandler;
  onSelectObject: () => void;
  selectedObject: Realm.Object | null;
}

export const ObjectSelector = ({
  toggle,
  focus,
  highlight,
  isOptional,
  onCellClick,
  onSelectObject,
  selectedObject,
  isOpen,
}: IObjectSelectorProps) => (
  <Modal size="lg" isOpen={isOpen} toggle={toggle} className="ConfirmModal">
    <ModalHeader toggle={toggle}>Select a new {focus.className}</ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      <ContentContainer
        focus={focus}
        hasEditingDisabled={true}
        highlight={highlight}
        onCellClick={onCellClick}
      />
    </ModalBody>
    <ModalFooter>
      {!selectedObject &&
        isOptional && (
          <Button color="primary" onClick={onSelectObject}>
            Set to null
          </Button>
        )}
      {selectedObject && (
        <Button color="primary" onClick={onSelectObject}>
          Select
        </Button>
      )}
      <Button color="secondary" onClick={toggle}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
);
