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
import { parseObjectId } from '../../../parsers';

interface IObjectIdControlState {
  internalValue: string | null;
}

export class ObjectIdControl extends React.PureComponent<
  IBaseControlProps<Realm.BSON.ObjectId | null>,
  IObjectIdControlState
> {
  state: IObjectIdControlState = {
    internalValue: this.props.value?.toHexString() ?? null,
  };

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
          <Button size="sm" onClick={this.handleClearValue}>
            <i className="fa fa-close" />
          </Button>
        ) : (
          <Button size="sm" onClick={this.generateObjectId}>
            <i className="fa fa-refresh" />
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

    let parsedId: Realm.BSON.ObjectId | null = null;

    if (value) {
      try {
        parsedId = parseObjectId(value, property);
      } catch (err) {
        if (err instanceof Error) {
          console.warn(err.message);
        } else {
          throw new Error('Expected an Error');
        }
      }
    }

    onChange(parsedId);
  };

  private generateObjectId = () => {
    const { onChange } = this.props;

    const generatedId = new Realm.BSON.ObjectId();

    this.setState({ internalValue: generatedId.toHexString() });
    onChange(generatedId);
  };
}
