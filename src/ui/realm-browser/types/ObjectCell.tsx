import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const ObjectCell = ({
  property,
  value,
  onContextMenu,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
}) => {
  const formatedValue = util.inspect(value);
  return (
    <div
      onContextMenu={onContextMenu}
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Content__ObjectCell',
      )}
      title={formatedValue}
    >
      {formatedValue}
    </div>
  );
};
