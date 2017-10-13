import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

export const display = (
  object: Realm.Object | null,
  inspectOnMissingPk = false,
) => {
  if (object) {
    const schema = object.objectSchema();
    if (schema.primaryKey) {
      const pk = (object as { [property: string]: any })[schema.primaryKey];
      return `${schema.name} {${schema.primaryKey} = ${pk}}`;
    } else if (inspectOnMissingPk) {
      const formatedValue = util
        .inspect(object, false, 0)
        .replace('RealmObject', ' ');
    } else {
      return schema.name;
    }
  } else {
    return 'null';
  }
};

export const ObjectCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: Realm.Object;
}) => {
  const displayValue = display(value);
  return (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Content__ObjectCell',
      )}
      title={displayValue}
    >
      {displayValue}
    </div>
  );
};
