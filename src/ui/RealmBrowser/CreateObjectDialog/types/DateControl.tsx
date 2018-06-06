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

import * as moment from 'moment';
import * as React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { parseDate } from '../../parsers';

import { IBaseControlProps } from './TypeControl';

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDThh:mm:ss.SSS';

export const DateControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <InputGroup className="CreateObjectDialog__DateControl">
    <Input
      className="CreateObjectDialog__DateControl__Input"
      type="datetime-local"
      step={0.001}
      onChange={e => onChange(parseDate(e.target.value, property))}
      required={!property.optional}
      placeholder={value === null ? 'null' : ''}
      value={value ? moment(value).format(DATETIME_LOCAL_FORMAT) : ''}
    />
    <InputGroupAddon addonType="append">
      <Button size="sm" onClick={() => onChange(new Date())} title="Set to now">
        <i className="fa fa-clock-o" />
      </Button>
      {value !== null && property.optional ? (
        <Button size="sm" onClick={() => onChange(null)}>
          <i className="fa fa-close" />
        </Button>
      ) : null}
    </InputGroupAddon>
    {children}
  </InputGroup>
);
