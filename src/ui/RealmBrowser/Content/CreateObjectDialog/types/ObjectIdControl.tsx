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

import React, { useState } from 'react';
import { ObjectId } from 'bson';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { IBaseControlProps } from './TypeControl';
import { parseObjectId } from '../../../parsers';

export const ObjectIdControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => {
  const [internalValue, setInternalValue] = useState<string | null>(value);

  const internalChangeHandler = (val: string | null) => {
    setInternalValue(val);

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

  const generateNewObjectId = () => {
    const generatedId = new ObjectId();

    setInternalValue(generatedId.toHexString());
    onChange(generatedId);
  };

  return (
    <InputGroup className="CreateObjectDialog__ObjectIdControl">
      <Input
        className="CreateObjectDialog__ObjectIdControl__Input"
        onChange={e => internalChangeHandler(e.target.value)}
        placeholder={value === null ? 'null' : ''}
        value={internalValue ?? ''}
        required={!property.optional}
        invalid={(!!internalValue || !property.optional) && value === null}
      />
      {internalValue && property.optional ? (
        <InputGroupAddon addonType="append">
          <Button size="sm" onClick={() => internalChangeHandler(null)}>
            <i className="fa fa-close" />
          </Button>
        </InputGroupAddon>
      ) : (
        <InputGroupAddon addonType="append">
          <Button size="sm" onClick={generateNewObjectId}>
            <i className="fa fa-refresh" />
          </Button>
        </InputGroupAddon>
      )}
      {children}
    </InputGroup>
  );
};
