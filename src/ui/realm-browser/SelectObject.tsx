import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ContentContainer } from './ContentContainer';

export interface IProps {
  status: boolean;
  schema: Realm.ObjectSchema;
  data: Realm.Results<any> | any;
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

  public setToNull = () => this.props.updateReference(null);

  public render() {
    const { status, schema, data, close, schemaName, optional } = this.props;
    const { rowToHighlight, objectToAdd, columnToHighlight } = this.state;
    return (
      <Modal size="lg" isOpen={status} toggle={close} className="ConfirmModal">
        <ModalHeader toggle={close}>Select a new {schemaName}</ModalHeader>
        <ModalBody className="RealmBrowser__SelectObject">
          {data &&
            schema && (
              <ContentContainer
                schema={schema}
                data={data}
                onCellClick={this.onCellClick}
                rowToHighlight={rowToHighlight}
                columnToHighlight={columnToHighlight}
              />
            )}
        </ModalBody>
        <ModalFooter>
          {objectToAdd && (
            <Button color="primary" onClick={this.setNewValue}>
              Set
            </Button>
          )}
          {optional && (
            <Button color="warning" onClick={this.setToNull}>
              Set to null
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
