import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';

import { displayObject } from '../../display';

export const ObjectCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: Realm.Object;
}) => {
  return (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Table__ObjectCell',
        {
          'RealmBrowser__Table__ObjectCell--null': value === null,
        },
      )}
    >
      {displayObject(value)}
    </div>
  );
};
