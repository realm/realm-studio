export const IndexedTypes = {
  name: 'IndexedTypes',
  primaryKey: 'intIndexed',
  properties: {
    boolIndexed: { type: 'bool', indexed: true },
    intIndexed: { type: 'int', indexed: true },
    stringIndexed: { type: 'string', indexed: true },
    dateIndexed: { type: 'date', indexed: true },
  },
};

export const OptionalTypes = {
  name: 'OptionalTypes',
  properties: {
    boolOptional: 'bool?',
    intOptional: 'int?',
    floatOptional: 'float?',
    doubleOptional: 'double?',
    stringOptional: 'string?',
    dateOptional: 'date?',
    dataOptional: 'data?',
    objectIdOptional: 'objectId?',
    decimal128Optional: 'decimal128?',
    objectOptional: 'RequiredTypes',
    boolOptionalArray: 'bool?[]',
    intOptionalArray: 'int?[]',
    floatOptionalArray: 'float?[]',
    doubleOptionalArray: 'double?[]',
    stringOptionalArray: 'string?[]',
    dateOptionalArray: 'date?[]',
    dataOptionalArray: 'data?[]',
    objectIdOptionalArray: 'objectId?[]',
    decimal128OptionalArray: 'decimal128?[]',
  },
};

export const RequiredTypes = {
  name: 'RequiredTypes',
  properties: {
    boolRequired: 'bool',
    intRequired: 'int',
    floatRequired: 'float',
    doubleRequired: 'double',
    stringRequired: 'string',
    dateRequired: 'date',
    dataRequired: 'data',
    objectIdRequired: 'objectId',
    decimal128Required: 'decimal128',
    boolRequiredArray: 'bool[]',
    intRequiredArray: 'int[]',
    floatRequiredArray: 'float[]',
    doubleRequiredArray: 'double[]',
    stringRequiredArray: 'string[]',
    dateRequiredArray: 'date[]',
    dataRequiredArray: 'data[]',
    objectIdRequiredArray: 'objectId[]',
    decimal128RequiredArray: 'decimal128[]',
    objectRequiredArray: 'RequiredTypes[]',
  },
};

export const LinkTypes = {
  name: 'LinkTypes',
  properties: {
    objectType: { type: 'ReverseType', optional: true },
    objectType2: { type: 'ReverseType', optional: true },
    listType: 'ReverseType[]',
    linkingObjects: {
      type: 'linkingObjects',
      objectType: 'ReverseType',
      property: 'links',
    },
  },
};

export const ReverseType = {
  name: 'ReverseType',
  properties: {
    links: 'LinkTypes',
  },
};

export const ChildEmbeddedType = {
  name: 'ChildEmbeddedType',
  embedded: true,
  properties: {
    id: 'int',
  },
};

export const ParentEmbeddedType = {
  name: 'ParentEmbeddedType',
  properties: {
    embeddedObject: 'ChildEmbeddedType',
    embeddedObjectList: 'ChildEmbeddedType[]',
  },
};
