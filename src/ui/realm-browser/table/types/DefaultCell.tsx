import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const DefaultCell = ({
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
      'RealmBrowser__Table__Input',
      'RealmBrowser__Table__Input--disabled',
    )}
  >
    {util.inspect(value)}
  </div>
);
