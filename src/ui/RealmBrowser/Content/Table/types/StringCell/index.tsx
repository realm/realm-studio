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
  temporalValue?: string;
}

export class StringCellContainer extends React.Component<
  IStringCellContainerProps,
  IStringCellContainerState
> {
  public state: IStringCellContainerState = {};

  private inputElement?: HTMLInputElement;

  public shouldComponentUpdate(
    nextProps: IStringCellContainerProps,
    nextState: IStringCellContainerState,
  ) {
    return (
      this.props.editMode !== nextProps.editMode ||
      this.props.value !== nextProps.value ||
      this.props.isHighlighted !== nextProps.isHighlighted ||
      this.state.temporalValue !== nextState.temporalValue
    );
  }

  public render() {
    const { isHighlighted, property } = this.props;
    return (
      <StringCell
        getRef={this.getInputRef}
        isDisabled={this.props.editMode === EditMode.Disabled}
        isHighlighted={isHighlighted || false}
        property={property}
        value={this.getDisplayValue()}
        onBlur={this.onBlur}
        onClick={this.onClick}
        onChange={this.onChange}
        onFocus={this.onFocus}
      />
    );
  }

  public onFocus = () => {
    if (typeof this.state.temporalValue !== 'string') {
      // The input field was just focussed - and we don't have a temporalValue
      const value = this.getDisplayValue();
      // Transform null and undefined into empty strings
      this.setState({ temporalValue: value === null ? '' : value });
    }
  };

  public onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      // Validate and propagate the change in value
      this.propagateChange();
      this.setState({ temporalValue: undefined });
    } catch (err) {
      const inputElement = this.inputElement;
      // The validation failed and the user is leaving the field - ask if they want to reset and leave
      const leave = this.showInvalidValueError(err.message);
      if (leave) {
        // Reset the temporalValue and signal a valid value
        this.setState({ temporalValue: undefined });
        this.props.onValidated(true);
        // Remove any existing custom validation errors
        if (inputElement) {
          inputElement.setCustomValidity('');
        }
      } else {
        // Indicate a validation error
        this.props.onValidated(false);
        // Make this cell highlighted (again)
        this.props.onHighlighted();

        // Focus the input element again
        if (inputElement) {
          setTimeout(() => {
            inputElement.focus();
          }, 100);
        }
      }
    }
  };

  public onChange = (value: string): void => {
    this.setState({ temporalValue: value }, () => {
      try {
        this.parseAndValidate();
        if (this.props.editMode === EditMode.KeyPress) {
          // TODO: Handle that this might throw
          this.propagateChange();
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`StringCell validation failed: ${err.message}`);
      }
    });
  };

  public onClick = (e: React.MouseEvent<any>): void => {
    // We can only edit cells that are not readOnly and highlighted
    /*
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
    */
  };

  private getDisplayValue() {
    const { temporalValue } = this.state;
    const { valueToString, value } = this.props;
    if (typeof temporalValue === 'string') {
      return temporalValue;
    } else if (valueToString) {
      return valueToString(value);
    } else {
      return value === null ? null : String(value);
    }
  }

  private getInputRef = (inputElement: HTMLInputElement) => {
    this.inputElement = inputElement;
  };

  /**
   * This will validate the temporalValue, `onValidated` will be called with the result and if the value is valid
   * `onUpdateValue` props will be called too.
   */
  private propagateChange() {
    // Try to parse, if the temporalValue is invalid an error will be thrown
    const parsedValue = this.parseAndValidate();
    // Prevent changes that override with the same value
    if (parsedValue !== this.props.value) {
      this.props.onUpdateValue(parsedValue);
    }
  }

  /**
   * Try parsing the temporalValue, set validation and call onValidated accordingly
   */
  private parseAndValidate() {
    const { temporalValue } = this.state;
    const { property } = this.props;
    if (typeof temporalValue === 'string') {
      try {
        const parsedValue = parse(temporalValue, property);
        this.props.onValidated(true);
        // Update the `inputElement` validation state
        if (this.inputElement) {
          this.inputElement.setCustomValidity('');
        }
        return parsedValue;
      } catch (err) {
        this.props.onValidated(false);
        // Update the `inputElement` validation state
        if (this.inputElement) {
          this.inputElement.setCustomValidity(err.message);
        }
        // Rethrow to allow the caller to use the message
        throw err;
      }
    } else {
      throw new Error(
        `parseAndValidate was called before temporalValue was sat: ${temporalValue}`,
      );
    }
  }

  private showInvalidValueError(message: string): boolean {
    const answer = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      // tslint:disable-next-line:max-line-length
      message,
      title: `Updating cell`,
      buttons: ['Leave without saving', 'Keep editing'],
      defaultId: 1,
      cancelId: 1,
    });
    return answer === 0;
  }
}

export { StringCellContainer as StringCell };
