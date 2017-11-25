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

export const isPrimitive = (type: string) => {
  return TYPES.indexOf(type) >= 0;
};
