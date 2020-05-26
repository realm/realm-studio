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
import { ObjectId } from 'bson';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { IBaseControlProps } from './TypeControl';
import { parseObjectId } from '../../../parsers';

interface IObjectIdControlState {
  internalValue: string | null;
}

export class ObjectIdControl extends React.PureComponent<
  IBaseControlProps,
  IObjectIdControlState
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
      <InputGroup className="CreateObjectDialog__ObjectIdControl">
        <Input
          className="CreateObjectDialog__ObjectIdControl__Input"
          onChange={this.inputChangeEventHandler}
          placeholder={value === null ? 'null' : ''}
          value={internalValue ?? ''}
          required={!property.optional}
          invalid={(!!internalValue || !property.optional) && value === null}
        />
        {internalValue && property.optional ? (
          <InputGroupAddon addonType="append">
            <Button size="sm" onClick={this.clearValue}>
              <i className="fa fa-close" />
            </Button>
          </InputGroupAddon>
        ) : (
          <InputGroupAddon addonType="append">
            <Button size="sm" onClick={this.generateObjectId}>
              <i className="fa fa-refresh" />
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

    let parsedId: ObjectId | null = null;

    if (val) {
      try {
        parsedId = parseObjectId(val, property);
      } catch (_) {
        // ignored
      }
    }

    onChange(parsedId);
  };

  private generateObjectId = () => {
    const { onChange } = this.props;

    const generatedId = new ObjectId();

    this.setState({ internalValue: generatedId.toHexString() });
    onChange(generatedId);
  };
}
