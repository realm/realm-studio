exports.ChildEmbeddedType = {
  name: 'ChildEmbeddedType',
  embedded: true,
  properties: {
    id: 'int'
  }
}

exports.IndexedTypes = {
  name: 'IndexedTypes',
  primaryKey: 'intIndexed',
  properties: {
    boolIndexed: { type: 'bool', indexed: true },
    intIndexed: 'int',
    stringIndexed: { type: 'string', indexed: true },
    dateIndexed: { type: 'date', indexed: true }
  }
}

exports.LinkTypes = {
  name: 'LinkTypes',
  properties: {
    objectType: 'ReverseType',
    objectType2: 'ReverseType',
    listType: 'ReverseType[]'
  }
}

exports.OptionalTypes = {
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
    decimal128OptionalArray: 'decimal128?[]'
  }
}

exports.ParentEmbeddedType = {
  name: 'ParentEmbeddedType',
  properties: {
    objectType: 'ChildEmbeddedType',
    listType: 'ChildEmbeddedType[]'
  }
}

exports.RequiredTypes = {
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
    objectRequiredArray: 'RequiredTypes[]'
  }
}

exports.ReverseType = {
  name: 'ReverseType',
  properties: {
    links: 'LinkTypes'
  }
}

