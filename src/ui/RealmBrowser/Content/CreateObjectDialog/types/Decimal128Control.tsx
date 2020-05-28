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
import { Decimal128 } from 'bson';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { IBaseControlProps } from './TypeControl';
import { parseDecimal128 } from '../../../parsers';

interface IDecimal128ControlState {
  internalValue: string | null;
}

export class Decimal128Control extends React.PureComponent<
  IBaseControlProps,
  IDecimal128ControlState
> {
  constructor(props: IBaseControlProps) {
    super(props);

    this.state = {
      internalValue: props.value,
    };
  }

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
          <InputGroupAddon addonType="append">
            <Button size="sm" onClick={this.clearValue}>
              <i className="fa fa-close" />
            </Button>
          </InputGroupAddon>
        )}
        {children}
      </InputGroup>
    );
  }

  private inputChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.internalChangeHandler(e.target.value);

  private clearValue = () => this.internalChangeHandler(null);

  private internalChangeHandler = (val: string | null) => {
    const { property, onChange } = this.props;

    this.setState({ internalValue: val });

    let parsedDecimal: Decimal128 | null = null;

    if (val) {
      try {
        parsedDecimal = parseDecimal128(val, property);
      } catch (_) {
        // ignored
      }
    }

    onChange(parsedDecimal);
  };
}
