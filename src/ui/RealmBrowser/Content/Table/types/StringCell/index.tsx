////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { remote } from 'electron';
import * as React from 'react';

import { EditMode } from '../../..';
import { IPropertyWithName } from '../../../..';
import { parse } from '../../../../parsers';

import { StringCell } from './StringCell';

export interface IStringCellContainerProps {
  editMode: EditMode;
  isHighlighted?: boolean;
  onHighlighted: () => void;
  onUpdateValue: (value: any) => void;
  onValidated: (valid: boolean) => void;
  property: IPropertyWithName;
  value: any;
  valueToString?: (value: any) => string;
}

interface IStringCellContainerState {
  temporalValue: any;
  isEditing: boolean;
}

export class StringCellContainer extends React.Component<
  IStringCellContainerProps,
  IStringCellContainerState
> {
  public static getDerivedStateFromProps(
    nextProps: IStringCellContainerProps,
    prevState: IStringCellContainerState,
  ) {
    const { value, isHighlighted } = nextProps;
    const isEditing = !isHighlighted ? false : prevState.isEditing;

    const state = {
      temporalValue: !isEditing
        ? StringCellContainer.getValueString(nextProps, value)
        : prevState.temporalValue,
      isEditing: !isHighlighted ? false : isEditing,
    };
    return state;
  }

  private static getValueString(
    props: IStringCellContainerProps,
    value: string,
  ) {
    if (props.valueToString) {
      return props.valueToString(value);
    } else {
      return value;
    }
  }

  public state: IStringCellContainerState = {
    temporalValue: '',
    isEditing: false,
  };

  private inputElement?: HTMLInputElement;

  public shouldComponentUpdate(
    nextProps: IStringCellContainerProps,
    nextState: IStringCellContainerState,
  ) {
    return (
      this.props.editMode !== nextProps.editMode ||
      this.props.value !== nextProps.value ||
      this.props.isHighlighted !== nextProps.isHighlighted ||
      this.state.isEditing !== nextState.isEditing ||
      this.state.temporalValue !== nextState.temporalValue
    );
  }

  public componentDidUpdate(
    prevProps: IStringCellContainerProps,
    prevState: IStringCellContainerState,
  ) {
    // Change the focus of the element, according to the value of isEditing
    if (this.inputElement) {
      if (this.state.isEditing) {
        this.inputElement.focus();
      } else if (this.inputElement === document.activeElement) {
        this.inputElement.blur();
      }
    }
  }

  public render() {
    const { isHighlighted, property } = this.props;
    return (
      <StringCell
        getRef={this.getInputRef}
        isEditing={this.state.isEditing}
        isHighlighted={isHighlighted || false}
        property={property}
        value={this.state.temporalValue}
        {...this}
      />
    );
  }

  public onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.state.isEditing) {
      try {
        const value = parse(this.state.temporalValue, this.props.property);
        if (value !== this.props.value) {
          this.props.onValidated(true);
          this.props.onUpdateValue(value);
          this.setState({ temporalValue: value, isEditing: false });
        }
      } catch (err) {
        const leave = this.showInvalidValueError(err.message);
        if (leave) {
          this.setState({ temporalValue: this.props.value, isEditing: false });
          this.props.onValidated(true);
        } else {
          this.props.onValidated(false);
          // Prevent getting blurred:
          // This doesn't work as the another input might be getting focussed.
          e.preventDefault();
          // Re-focus
          const inputElement = this.inputElement;
          if (inputElement) {
            setTimeout(() => {
              inputElement.focus();
            }, 100);
          }
        }
      }
    }
  };

  public onChange = (value: string): void => {
    this.setState({ temporalValue: value });
    if (this.props.editMode === EditMode.KeyPress) {
      try {
        const parsedValue = parse(value, this.props.property);
        this.props.onValidated(true);
        this.props.onUpdateValue(parsedValue);
      } catch (err) {
        // Probably a parsing error
        // tslint:disable-next-line:no-console
        console.warn(`Error parsing the input: ${err.message}`);
        this.props.onValidated(false);
      }
    }
  };

  public onFocus = (): void => {
    if (!this.props.isHighlighted) {
      this.props.onHighlighted();
    }
  };

  public onClick = (e: React.MouseEvent<any>): void => {
    // We can only edit cells that are not readOnly and highlighted
    if (
      this.props.isHighlighted &&
      !this.props.property.readOnly &&
      this.props.editMode !== EditMode.Disabled
    ) {
      // Go into edit mode if not already
      if (!this.state.isEditing) {
        this.setState({ isEditing: true });
      }
    }
  };

  private getInputRef = (inputElement: HTMLInputElement) => {
    this.inputElement = inputElement;
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

export { StringCellContainer as StringCell };
