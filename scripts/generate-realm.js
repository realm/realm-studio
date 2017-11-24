const faker = require('faker');
const path = require('path');
const Realm = require('realm');

const OBJECTS_PER_CLASS = 25;
const MAX_LIST_LENGTH = 25;

const PRIMITIVE_TYPES = ['bool', 'int', 'float', 'double', 'data', 'date', 'string'];

const getOutputPath = () => {
  if (process.argv.length >= 3) {
    return path.resolve(process.argv[2]);
  } else {
    return path.resolve(__dirname, '../all-types.realm');
  }
};

const isPrimitive = type => {
  return PRIMITIVE_TYPES.indexOf(type) >= 0;
};

const generateValue = (realm, property, depth = 0) => {
  if (typeof(property) === 'string' && isPrimitive(property)) {
    return generateValue(realm, {
      type: property,
    });
  } else if (typeof(property) === 'string') {
    throw new Error(`Unsupported string property: ${property}`);
  }
  // This is strange - optional on lists refers to the elements
  if (property.type !== 'list' && property.optional) {
    // 50% will be nulls, if optional
    if (faker.random.boolean()) {
      return null;
    }
  }
  if (property.type === 'bool') {
    return faker.random.boolean();
  } else if (property.type === 'string') {
    return faker.lorem.text();
  } else if (property.type === 'int') {
    return faker.random.number();
  } else if (property.type === 'float' || property.type === 'double') {
    return Math.sqrt(Number.MAX_SAFE_INTEGER) * Math.random();
  } else if (property.type === 'date') {
    return faker.date.past();
  } else if (property.type === 'data') {
    return new Buffer(faker.lorem.text());
  } else if (property.type === 'object') {
    return getRandomObject(realm, property.objectType, depth);
  } else if (property.type === 'list') {
    if (depth > 2) {
      return [];
    } else {
      const length = faker.random.number(MAX_LIST_LENGTH);
      const list = [];
      for (let i = 0; i < length; i++) {
        let item;
        if (property.objectType && isPrimitive(property.objectType)) {
          item = generateValue(realm, property.objectType, depth);
        } else if (property.objectType) {
          item = getRandomObject(realm, property.objectType, depth);
        } else {
          throw new Error(`Unsupported list type`);
        }
        list.push(item);
      }
      return list;
    }
  } else if (property.type === 'linkingObjects') {
    // Skip
    // console.log(`Skipping ${property.name} as it will be created from the opposite side`);
  } else {
    throw new Error(`Unsupported property`);
  }
};

const generateObject = (realm, schemaClass, depth = 0) => {
  if (typeof(schemaClass) === 'string') {
    // console.log(`Generating a ${schemaClass} (from string)`, depth);
    const schemaClassObject = Object.values(realm.schema).find(s => s.name === schemaClass);
    return generateObject(realm, schemaClassObject, depth + 1);
  } else {
    // console.log(`Generating a ${schemaClass.name}`, depth);
    const newObject = {};
    for (let propertyName in schemaClass.properties) {
      const property = schemaClass.properties[propertyName];
      const value = generateValue(realm, property, depth + 1);
      newObject[propertyName] = value;
    }
    // Create it in the database
    // console.log(`Creating a ${schemaClass.name}`, newObject);
    realm.create(schemaClass.name, newObject);
    return newObject;
  }
};

const getRandomObject = (realm, className, depth = 0) => {
  const objects = realm.objects(className);
  const createRandomly = faker.random.boolean();
  // console.log(`Currently there're ${objects.length} ${className}`);
  if (objects.length === 0 || createRandomly) {
    return generateObject(realm, className, depth);
  } else {
    return faker.random.arrayElement(objects);
  }
};

const outputPath = getOutputPath();
const allTypesSchema = require('../src/services/schema-export/tests/models/all/AllTypes');
const realm = new Realm({
  path: outputPath,
  schema: Object.values(allTypesSchema),
});

try {
  realm.write(() => {
    for (let schemaClass of realm.schema) {
      console.log(`Generating object for the '${schemaClass.name}' class`);
      for (let objectIndex = 0; objectIndex < OBJECTS_PER_CLASS; objectIndex++) {
        generateObject(realm, schemaClass);
      }
    }
  });
  process.exit(0);
} catch (err) {
  console.log(err);
  process.exit(-1);
}
