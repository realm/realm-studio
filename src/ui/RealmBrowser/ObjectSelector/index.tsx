import * as React from 'react';

import { IPropertyWithName } from '..';
import { IClassFocus } from '../focus';
import { CellClickHandler, IHighlight } from '../Table';

import { ObjectSelector } from './ObjectSelector';

export interface ISelectObjectProps {
  toggle: () => void;
  focus: IClassFocus;
  isOptional?: boolean;
  onObjectSelected: (object: Realm.Object | null) => void;
  isOpen: boolean;
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
        focus={this.props.focus}
        isOpen={this.props.isOpen}
        isOptional={this.props.isOptional || false}
        onCellClick={this.onCellClick}
        onResetHighlight={this.onResetHighlight}
        onSelectObject={this.onSelectObject}
        toggle={this.props.toggle}
        {...this.state}
      />
    );
  }

  private onCellClick: CellClickHandler = ({
    rowObject,
    cellValue,
    rowIndex,
    columnIndex,
  }) => {
    this.setState({
      highlight: {
        column: columnIndex,
        rows: new Set([rowIndex]),
      },
      selectedObject: rowObject,
    });
  };

  private onResetHighlight = () => {
    this.setState({
      highlight: {
        column: 0,
        rows: new Set([]),
      },
      selectedObject: null,
    });
  };

  private onSelectObject = () =>
    this.props.onObjectSelected(this.state.selectedObject);
}

export { ObjectSelectorContainer as ObjectSelector };
