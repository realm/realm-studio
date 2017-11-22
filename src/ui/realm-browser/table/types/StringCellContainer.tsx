import { remote } from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { EditMode, IPropertyWithName } from '../..';
import { parse } from './parser';
import { StringCell } from './StringCell';

export interface IStringCellContainerProps {
  editMode: EditMode;
  onUpdateValue: (value: any) => void;
  property: IPropertyWithName;
  value: string;
}

interface IStringCellContainerState {
  temporalValue: string;
  isEditing: boolean;
}

export class StringCellContainer extends React.Component<
  IStringCellContainerProps,
  IStringCellContainerState
> {
  constructor(props: IStringCellContainerProps) {
    super();
    this.state = {
      temporalValue: props.value,
      isEditing: false,
    };
  }

  public componentWillReceiveProps(props: IStringCellContainerProps) {
    const { value } = props;
    const { isEditing } = this.state;

    if (!isEditing) {
      this.setState({
        temporalValue: value,
      });
    }
  }

  public render() {
    const { value, property } = this.props;

    return (
      <StringCell
        isEditing={this.state.isEditing}
        property={property}
        value={this.state.isEditing ? this.state.temporalValue : value}
        {...this}
      />
    );
  }

  public shouldComponentUpdate(
    nextProps: IStringCellContainerProps,
    nextState: IStringCellContainerState,
  ) {
    return (
      this.props.value !== nextProps.value ||
      this.state.isEditing !== nextState.isEditing ||
      this.state.temporalValue !== nextState.temporalValue
    );
  }

  public onFocus = (): void => {
    // We can only edit cells that are not readOnly
    if (!this.props.property.readOnly) {
      this.setState({ isEditing: true });
    }
  };

  public onChange = (value: string, input: HTMLInputElement): void => {
    this.setState({ temporalValue: value });
    if (this.props.editMode === EditMode.KeyPress) {
      try {
        const parsedValue = parse(value, this.props.property);
        this.props.onUpdateValue(parsedValue);
      } catch (err) {
        // Probably a parsing error
        // tslint:disable-next-line:no-console
        console.warn(`Error parsing the input: ${err.message}`);
      }
    }
  };

  public onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const value = parse(this.state.temporalValue, this.props.property);
      if (value !== this.props.value) {
        this.props.onUpdateValue(value);
        this.setState({ temporalValue: value.toString(), isEditing: false });
      }
    } catch (err) {
      const leave = this.showInvalidValueError(err.message);
      if (leave) {
        this.setState({ temporalValue: this.props.value, isEditing: false });
      } else {
        const inputField = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          inputField.focus();
        }, 100);
      }
    }
  };

  private showInvalidValueError(message: string): boolean {
    const answer = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      // tslint:disable-next-line:max-line-length
      message: `${message}\n\nIf you leave the cell with an invalid value, the changes to the content will not be saved.`,
      title: `Updating cell`,
      buttons: ['Leave without saving', 'Keep editing'],
      defaultId: 1,
      cancelId: 1,
    });
    return answer === 0;
  }
}
