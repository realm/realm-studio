const IndexedTypesSchema = {
  name: 'IndexedTypes',
  properties: {
    boolIndexed: { type: 'bool',  indexed: true },
    intIndexed: { type: 'int',  indexed: true },
    stringIndexed: { type: 'string',  indexed: true },
    dateIndexed: { type: 'date',  indexed: true }
  }
};

const LinkTypesSchema = {
  name: 'LinkTypes',
  properties: {
    objectType: { type: 'ReverseType',  optional: true },
    objectType2: { type: 'ReverseType',  optional: true },
    listType: 'ReverseType[]'
  }
};

const OptionalTypesSchema = {
  name: 'OptionalTypes',
  properties: {
    boolOptional: { type: 'bool',  optional: true },
    intOptional: { type: 'int',  optional: true },
    floatOptional: { type: 'float',  optional: true },
    doubleOptional: { type: 'double',  optional: true },
    stringOptional: { type: 'string',  optional: true },
    dateOptional: { type: 'date',  optional: true },
    dataOptional: { type: 'data',  optional: true },
    objectOptional: { type: 'RequiredTypes',  optional: true },
    boolOptionalArray: { type: 'bool[]',  optional: true },
    intOptionalArray: { type: 'int[]',  optional: true },
    floatOptionalArray: { type: 'float[]',  optional: true },
    doubleOptionalArray: { type: 'double[]',  optional: true },
    stringOptionalArray: { type: 'string[]',  optional: true },
    dateOptionalArray: { type: 'date[]',  optional: true },
    dataOptionalArray: { type: 'data[]',  optional: true }
  }
};

const RequiredTypesSchema = {
  name: 'RequiredTypes',
  properties: {
    boolRequired: 'bool',
    intRequired: 'int',
    floatRequired: 'float',
    doubleRequired: 'double',
    stringRequired: 'string',
    dateRequired: 'date',
    dataRequired: 'data',
    boolRequiredArray: 'bool[]',
    intRequiredArray: 'int[]',
    floatRequiredArray: 'float[]',
    doubleRequiredArray: 'double[]',
    stringRequiredArray: 'string[]',
    dateRequiredArray: 'date[]',
    dataRequiredArray: 'data[]',
    objectRequiredArray: 'RequiredTypes[]'
  }
};

const ReverseTypeSchema = {
  name: 'ReverseType',
  properties: {
    links: { type: 'LinkTypes',  optional: true }
  }
};

module.exports = {
  IndexedTypesSchema,
  LinkTypesSchema,
  OptionalTypesSchema,
  RequiredTypesSchema,
  ReverseTypeSchema
};
