import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { EditMode, IPropertyWithName } from '..';
import { Content } from '../Content';
import { IClassFocus } from '../focus';
import { CellClickHandler, IHighlight } from '../Table';

export interface IObjectSelectorStateProps {
  focus: IClassFocus;
  isOpen: boolean;
}

export interface IObjectSelectorProps extends IObjectSelectorStateProps {
  highlight?: IHighlight;
  isOptional: boolean;
  onCellClick: CellClickHandler;
  onResetHighlight: () => void;
  onSelectObject: () => void;
  selectedObject: Realm.Object | null;
  toggle: () => void;
}

export const ObjectSelector = ({
  focus,
  highlight,
  isOpen,
  isOptional,
  onCellClick,
  onResetHighlight,
  onSelectObject,
  selectedObject,
  toggle,
}: IObjectSelectorProps) => (
  <Modal size="lg" isOpen={isOpen} toggle={toggle} className="ConfirmModal">
    <ModalHeader toggle={toggle}>Select a new {focus.className}</ModalHeader>
    <ModalBody className="RealmBrowser__SelectObject">
      <Content
        editMode={EditMode.Disabled}
        onResetHighlight={onResetHighlight}
        focus={focus}
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
