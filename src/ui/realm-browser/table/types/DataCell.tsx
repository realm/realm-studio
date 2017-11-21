import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const display = (value: ArrayBuffer | null) =>
  value ? `[${value.byteLength} bytes of data]` : 'null';

export const DataCell = ({
  isScrolling,
  property,
  value,
}: {
  isScrolling: boolean;
  property: Realm.ObjectSchemaProperty;
  value: ArrayBuffer | null;
}) => (
  <div
    className={classnames(
      'form-control',
      'form-control-sm',
      'RealmBrowser__Table__Input',
      'RealmBrowser__Table__Input--disabled',
    )}
  >
    {display(value)}
  </div>
);
