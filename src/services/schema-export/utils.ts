// Note: shouldn't 'object id' & 'decimal' be renamed to 'objectId' & 'decimal128' by realm-js?

export function isPrimitive(type: string | undefined) {
  switch (type) {
    case 'bool':
    case 'int':
    case 'float':
    case 'double':
    case 'string':
    case 'data':
    case 'date':
    case 'object id':
    case 'objectId':
    case 'decimal':
    case 'decimal128':
      return true;
    default:
      return false;
  }
}

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

const BSON_TYPES = ['objectId', 'decimal128'];
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
