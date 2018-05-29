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
