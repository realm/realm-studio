exports.RealmTestClass0 = {
  name: 'RealmTestClass0',
  properties: {
    integerValue: 'int',
    stringValue: 'string?',
    dataValue: 'data?'
  }
}

exports.RealmTestClass1 = {
  name: 'RealmTestClass1',
  properties: {
    integerValue: 'int',
    boolValue: 'bool',
    floatValue: 'float',
    doubleValue: 'double',
    stringValue: 'string?',
    dateValue: 'date?',
    arrayReference: 'RealmTestClass0[]'
  }
}

exports.RealmTestClass2 = {
  name: 'RealmTestClass2',
  properties: {
    integerValue: 'int',
    boolValue: 'bool',
    objectReference: 'RealmTestClass1'
  }
}

