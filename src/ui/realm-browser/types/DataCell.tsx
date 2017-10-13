import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const displayValue = (value: ArrayBuffer) => {
  return `[${value.byteLength} bytes of data]`;
};

export const DataCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => (
  <div
    className={classnames(
      'form-control',
      'form-control-sm',
      'RealmBrowser__Content__Input',
      'RealmBrowser__Content__Input--disabled',
    )}
  >
    {displayValue(value)}
  </div>
);
