import * as React from 'react';

import { IPropertyWithName } from '..';
import { IClassFocus } from '../focus';
import { CellClickHandler, IHighlight } from '../table';

import { ObjectSelector } from './ObjectSelector';

export interface ISelectObjectProps {
  close: () => void;
  focus: IClassFocus;
  onObjectSelected: (object: Realm.Object | null) => void;
  property: IPropertyWithName;
  status: boolean;
}

export interface ISelectObjectState {
  highlight?: IHighlight;
  selectedObject: Realm.Object | null;
}

export class ObjectSelectorContainer extends React.Component<
  ISelectObjectProps,
  ISelectObjectState
> {
  public state: ISelectObjectState = {
    selectedObject: null,
  };

  public render() {
    return (
      <ObjectSelector
        onSelectObject={this.onSelectObject}
        onCellClick={this.onCellClick}
        {...this.props}
        {...this.state}
      />
    );
  }

  private onCellClick: CellClickHandler = ({
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
      selectedObject: rowObject,
    });
  };

  private onSelectObject = () =>
    this.props.onObjectSelected(this.state.selectedObject);
}
