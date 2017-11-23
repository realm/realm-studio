import * as moment from 'moment';
import * as React from 'react';
import { Input } from 'reactstrap';
import * as Realm from 'realm';

import { parseDate } from '../../parsers';

import { IBaseControlProps } from './TypeControl';

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDThh:mm:ss.SSS';

export const DateControl = ({
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <Input
    type="datetime-local"
    onChange={e => onChange(parseDate(e.target.value))}
    required={!property.optional}
    value={value ? moment(value).format(DATETIME_LOCAL_FORMAT) : ''}
  />
);
