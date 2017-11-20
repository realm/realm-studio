exports.SampleTypes = {
  name: 'SampleTypes',
  primaryKey: 'primary',
  properties: {
    primary: 'int',
    ArrayFloatValue: 'float?',
    listOfStrings: 'string[]',
    listOfOptionalDates: 'date?[]',
    indexedInt: { type: 'int', indexed: true },
    linkToObject: 'SampleTypes',
    listOfObjects: 'SampleTypes[]',
    objectsLinkingToThisObject: { type: 'linkingObjects', objectType: 'SampleTypes', property: 'linkToObject' }
  }
}
