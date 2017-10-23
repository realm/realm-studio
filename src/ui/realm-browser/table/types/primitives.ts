import * as Realm from 'realm';

export const TYPES = [
  'bool',
  'int',
  'float',
  'double',
  'string',
  'data',
  'date',
];

export const getObjectSchema = (
  type: Realm.PropertyType,
): Realm.ObjectSchema => {
  return {
    name: `${type}[]`,
    properties: {
      value: {
        type,
      },
    },
  };
};
