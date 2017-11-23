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
    listType: 'ReverseType[]',
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
    objectOptional: 'RequiredTypes',
    boolOptionalArray: 'bool?[]',
    intOptionalArray: 'int?[]',
    floatOptionalArray: 'float?[]',
    doubleOptionalArray: 'double?[]',
    stringOptionalArray: 'string?[]',
    dateOptionalArray: 'date?[]',
    dataOptionalArray: 'data?[]'
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
    boolRequiredArray: 'bool[]',
    intRequiredArray: 'int[]',
    floatRequiredArray: 'float[]',
    doubleRequiredArray: 'double[]',
    stringRequiredArray: 'string[]',
    dateRequiredArray: 'date[]',
    dataRequiredArray: 'data[]',
    objectRequiredArray: 'RequiredTypes[]'
  }
}

exports.ReverseType = {
  name: 'ReverseType',
  properties: {
    links: 'LinkTypes'
  }
}

