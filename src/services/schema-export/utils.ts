export function isPrimitive(type: string | undefined) {
  switch (type) {
    case 'bool':
    case 'int':
    case 'float':
    case 'double':
    case 'string':
    case 'data':
    case 'date':
    case 'object id': // TODO: remove once https://github.com/realm/realm-js/pull/3235 is merged & consumed.
    case 'objectId':
    case 'decimal': // TODO: remove once https://github.com/realm/realm-js/pull/3235 is merged & consumed.
    case 'decimal128':
    case 'uuid':
      return true;
    default:
      return false;
  }
}

// Due to a bug in realm-js, we incorrectly get 'object id'/'decimal' for .type & .objectType in some scenarios.
// TODO: remove (including usages) once https://github.com/realm/realm-js/pull/3235 is merged & consumed.
export const reMapType = (type: string): string => {
  switch (type) {
    case 'object id':
      return 'objectId';
    case 'decimal':
      return 'decimal128';
    default:
      return type;
  }
};

const BSON_TYPES = ['objectId', 'uuid', 'decimal128'];
export const isBsonType = (prop: Realm.ObjectSchemaProperty): boolean =>
  BSON_TYPES.includes(prop.type) ||
  (!!prop.objectType && BSON_TYPES.includes(reMapType(prop.objectType)));

export interface INamedObjectSchemaProperty extends Realm.ObjectSchemaProperty {
  name: string;
}

export const filteredProperties = (propsMap: Realm.PropertiesTypes) => {
  const props = Object.values(propsMap) as INamedObjectSchemaProperty[];

  return props.filter(prop => prop.type !== 'linkingObjects');
};
