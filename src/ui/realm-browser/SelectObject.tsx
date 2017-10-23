import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { ContentContainer } from './ContentContainer';
import { IFocus } from './focus';
import { CellClickHandler, IHighlight } from './table';

export interface ISelectObjectProps {
  focus: IFocus;
  status: boolean;
  close: () => void;
  schemaName: string;
  updateReference: (object: any) => void;
  optional: boolean;
}

export interface ISelectObjectState {
  highlight?: IHighlight;
  objectToAdd?: Realm.ObjectSchema;
}

export class SelectObject extends React.Component<
  ISelectObjectProps,
  ISelectObjectState
> {
  public state: ISelectObjectState = {};

  public onCellClick: CellClickHandler = ({
    rowObject,
    property,
    cellValue,
    rowIndex,
    columnIndex,
  }) => {
    this.setState({
      highlight: {
        column: columnIndex,
        row: rowIndex,
      },
      objectToAdd: rowObject,
    });
  };

  public setNewValue = () => this.props.updateReference(this.state.objectToAdd);

  public render() {
    const { focus, status, close, schemaName, optional } = this.props;
    const { objectToAdd, highlight } = this.state;
    return (
      <Modal size="lg" isOpen={status} toggle={close} className="ConfirmModal">
        <ModalHeader toggle={close}>Select a new {schemaName}</ModalHeader>
        <ModalBody className="RealmBrowser__SelectObject">
          {focus && (
            <ContentContainer
              focus={focus}
              highlight={highlight}
              onCellClick={this.onCellClick}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {optional && (
            <Button color="primary" onClick={this.setNewValue}>
              Set {!objectToAdd && 'to null'}
            </Button>
          )}
          <Button color="secondary" onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
