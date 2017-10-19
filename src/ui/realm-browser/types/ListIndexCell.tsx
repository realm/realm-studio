import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const ListIndexCell = ({ value }: { value: number }) => (
  <div
    className={classnames(
      'form-control',
      'form-control-sm',
      'RealmBrowser__Content__Input',
      'RealmBrowser__Content__Input--disabled',
    )}
  >
    {value}
  </div>
);
