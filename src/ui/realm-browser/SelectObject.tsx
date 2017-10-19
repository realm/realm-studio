import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { ContentContainer } from './ContentContainer';
import { IFocus } from './focus';

export interface IProps {
  focus: IFocus;
  status: boolean;
  close: () => void;
  schemaName: string;
  updateReference: (object: any) => void;
  optional: boolean;
}

export interface IState {
  rowToHighlight?: number;
  columnToHighlight?: number;
  objectToAdd?: Realm.ObjectSchema;
}

export class SelectObject extends React.Component<IProps, IState> {
  public state = {
    rowToHighlight: undefined,
    columnToHighlight: undefined,
    objectToAdd: undefined,
  };

  public onCellClick = (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => {
    this.setState({
      rowToHighlight: rowIndex,
      columnToHighlight: columnIndex,
      objectToAdd: object,
    });
  };

  public setNewValue = () => this.props.updateReference(this.state.objectToAdd);

  public render() {
    const { focus, status, close, schemaName, optional } = this.props;
    const { rowToHighlight, objectToAdd, columnToHighlight } = this.state;
    return (
      <Modal size="lg" isOpen={status} toggle={close} className="ConfirmModal">
        <ModalHeader toggle={close}>Select a new {schemaName}</ModalHeader>
        <ModalBody className="RealmBrowser__SelectObject">
          {focus && (
            <ContentContainer
              focus={focus}
              onCellClick={this.onCellClick}
              rowToHighlight={rowToHighlight}
              columnToHighlight={columnToHighlight}
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
