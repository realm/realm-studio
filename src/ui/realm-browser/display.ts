import * as util from 'util';

export const displayObject = (
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
