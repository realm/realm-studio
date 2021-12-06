////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
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

import React from 'react';
import Realm from 'realm';
import { Button, Input, InputGroup } from 'reactstrap';

import { IBaseControlProps } from './TypeControl';
import { parseDecimal128 } from '../../../parsers';

interface IDecimal128ControlState {
  internalValue: string | null;
}

export class Decimal128Control extends React.PureComponent<
  IBaseControlProps<Realm.BSON.Decimal128 | null>,
  IDecimal128ControlState
> {
  state: IDecimal128ControlState = {
    internalValue: this.props.value?.toString() ?? null,
  };

  render() {
    const { children, property, value } = this.props;
    const { internalValue } = this.state;

    return (
      <InputGroup className="CreateObjectDialog__Decimal128Control">
        <Input
          className="CreateObjectDialog__Decimal128Control__Input"
          onChange={this.inputChangeEventHandler}
          placeholder={value === null ? 'null' : ''}
          value={internalValue ?? ''}
          required={!property.optional}
          invalid={(!!internalValue || !property.optional) && value === null}
        />
        {internalValue && property.optional && (
          <Button size="sm" onClick={this.handleClearValue}>
            <i className="fa fa-close" />
          </Button>
        )}
        {children}
      </InputGroup>
    );
  }

  private inputChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.changeHandler(e.target.value);

  private handleClearValue = () => this.changeHandler(null);

  private changeHandler = (value: string | null) => {
    const { property, onChange } = this.props;

    this.setState({ internalValue: value });

    let parsedDecimal: Realm.BSON.Decimal128 | null = null;

    if (value) {
      try {
        parsedDecimal = parseDecimal128(value, property);
      } catch (err) {
        if (err instanceof Error) {
          console.warn(err.message);
        } else {
          throw new Error('Expected an Error');
        }
      }
    }

    onChange(parsedDecimal);
  };
}
