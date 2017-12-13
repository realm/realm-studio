import * as assert from 'assert';
import fs = require('fs-extra');
import { ObjectSchemaProperty } from 'realm';
import { CSVDataImporter } from '../csv/CSVDataImporter';
import ImportSchemaGenerator from '../ImportSchemaGenerator';
import { ImportFormat } from '../index';
import Util from '../Util';

const TESTS_PATH = './src/services/data-importer/tests';

describe('Import CSV tests', () => {
  describe('Util helper methods', () => {
    it('parses strings to booleans', () => {
      assert.equal(Util.isBoolean('true'), true);
      assert.equal(Util.isBoolean('TRUE'), true);
      assert.equal(Util.isBoolean('TrUe'), true);

      assert.equal(Util.isBoolean('false'), true);
      assert.equal(Util.isBoolean('FALSE'), true);
      assert.equal(Util.isBoolean('FaLse'), true);

      assert.equal(Util.isBoolean('123'), false);
      assert.equal(Util.isBoolean(' false'), false);
      assert.equal(Util.isBoolean('true '), false);
    });

    it('parses strings to ints', () => {
      assert.equal(Util.isInt('123'), true);
      assert.equal(Util.isInt('3.14'), false);
      assert.equal(Util.isInt('true'), false);
      assert.equal(Util.isInt('A094E453-46FD-4F13-AD2F-7333E2C4ABCA'), false);
    });

    it('parses strings to doubles', () => {
      assert.equal(Util.isDouble('3.14'), true);
      assert.equal(Util.isDouble('3.0'), true);
      assert.equal(Util.isDouble('3'), true); // always check isInt before isDouble when parsing!
      assert.equal(Util.isDouble('true'), false);
      assert.equal(Util.isDouble('0XCAFEBABE'), false);
    });
  });

  it('Generates a valid Cat schema', () => {
    const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

    const schemaGenerator = new ImportSchemaGenerator(ImportFormat.CSV, files);
    const schema = schemaGenerator.generate();

    assert.equal(schema.length, 1, 'Expected to parse one schema (Cat)');
    const catSchema = schema[0];
    assert.equal(catSchema.name, 'Cat', 'Expected to parse schema named (Cat)');
    assert.equal(catSchema.properties.name, 'string?');
    assert.equal(catSchema.properties.age, 'int?');
    assert.equal(catSchema.properties.height, 'double?');
    assert.equal(catSchema.properties.weight, 'int?');
    assert.equal(catSchema.properties.hasTail, 'bool?');
    assert.equal(catSchema.properties.birthday, 'string?');
    assert.equal(catSchema.properties.owner, 'string?');
    assert.equal(catSchema.properties.scaredOfDog, 'string?');
  });

  describe('Creating and populating the Realm', () => {
    const REALM_FILE_DIR = `${TESTS_PATH}/temporal`;

    before(() => {
      fs.removeSync(REALM_FILE_DIR);
      fs.mkdir(REALM_FILE_DIR);
    });

    it('Create a valid Cat Realm file', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      csvImporter.createNewRealmFile(REALM_FILE_DIR);

      const expectedRealmFile = `${REALM_FILE_DIR}/default.realm`;
      assert.equal(
        fs.existsSync(expectedRealmFile),
        true,
        `Realm file was not found at the expected path: ${expectedRealmFile}`,
      );

      // open the Realm and make sure the schema matches
      const realm = new Realm(expectedRealmFile);

      assert.equal(realm.schema.length, 1, 'Expected to find one schema (Cat)');
      const catSchema = realm.schema[0];
      assert.equal(
        catSchema.name,
        'Cat',
        'Expected Schema name to match (Cat)',
      );

      assert.equal(catSchema.properties.hasOwnProperty('name'), true);
      const nameProperty = catSchema.properties.name as ObjectSchemaProperty;
      assert.equal(nameProperty.type, 'string');
      assert.equal(nameProperty.optional, true);
      assert.equal(nameProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('age'), true);
      const ageProperty = catSchema.properties.age as ObjectSchemaProperty;
      assert.equal(ageProperty.type, 'int');
      assert.equal(ageProperty.optional, true);
      assert.equal(ageProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('height'), true);
      const heightProperty = catSchema.properties
        .height as ObjectSchemaProperty;
      assert.equal(heightProperty.type, 'double');
      assert.equal(heightProperty.optional, true);
      assert.equal(heightProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('weight'), true);
      const weightProperty = catSchema.properties
        .weight as ObjectSchemaProperty;
      assert.equal(weightProperty.type, 'int');
      assert.equal(weightProperty.optional, true);
      assert.equal(weightProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('hasTail'), true);
      const hasTailProperty = catSchema.properties
        .hasTail as ObjectSchemaProperty;
      assert.equal(hasTailProperty.type, 'bool');
      assert.equal(hasTailProperty.optional, true);
      assert.equal(hasTailProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('birthday'), true);
      const birthdayProperty = catSchema.properties
        .birthday as ObjectSchemaProperty;
      assert.equal(birthdayProperty.type, 'string');
      assert.equal(birthdayProperty.optional, true);
      assert.equal(birthdayProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('owner'), true);
      const ownerProperty = catSchema.properties.owner as ObjectSchemaProperty;
      assert.equal(ownerProperty.type, 'string');
      assert.equal(ownerProperty.optional, true);
      assert.equal(ownerProperty.indexed, false);

      assert.equal(catSchema.properties.hasOwnProperty('scaredOfDog'), true);
      const scaredOfDogProperty = catSchema.properties
        .scaredOfDog as ObjectSchemaProperty;
      assert.equal(scaredOfDogProperty.type, 'string');
      assert.equal(scaredOfDogProperty.optional, true);
      assert.equal(scaredOfDogProperty.indexed, false);

      realm.close();
    });

    it('Populate a valid Cat Realm file', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      const realm = csvImporter.import(REALM_FILE_DIR);
      const cats = realm.objects('Cat').sorted('name');
      assert.equal(cats.length, 2);
      let cat = cats[0] as any;
      assert.equal(cat.name, 'Kitty');
      assert.equal(cat.age, 3);
      assert.equal(cat.height, 22.1);
      assert.equal(cat.weight, 0);
      assert.equal(cat.hasTail, false);
      assert.equal(cat.birthday, '<null>');
      assert.equal(cat.owner, '<null>');
      assert.equal(cat.scaredOfDog, '<null>');

      cat = cats[1] as any;
      assert.equal(cat.name, 'Ninneko');
      assert.equal(cat.age, 4);
      assert.equal(cat.height, 21.0);
      assert.equal(cat.weight, 0);
      assert.equal(cat.hasTail, true);
      assert.equal(cat.birthday, '<null>');
      assert.equal(cat.owner, '<null>');
      assert.equal(cat.scaredOfDog, '<null>');

      realm.close();
    });

    it('Invalid CSV should not generate a Realm file', () => {
      // the types of the generated Realm are infered automatically from the first line
      // of the CSV, if the subsequent lines contains data that doesn't match the schema
      // the parsing will stop and the empty file will be removed.
      const files: string[] = [`${TESTS_PATH}/csv/invalid_second_line.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      assert.throws(() => csvImporter.import(REALM_FILE_DIR), Error);
    });

    it('Multiple CSV should generate one Realm file', () => {
      const files: string[] = [
        `${TESTS_PATH}/csv/dogs.csv`,
        `${TESTS_PATH}/csv/people.csv`,
      ];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      const realm = csvImporter.import(REALM_FILE_DIR);
      const people = realm.objects('people');
      const dogs = realm.objects('dogs');
      assert.equal(people.length, 2);
      assert.equal(dogs.length, 2);
      realm.close();
    });

    it('Parsing should support optional values', () => {
      const files: string[] = [`${TESTS_PATH}/csv/optional.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      const realm = csvImporter.import(REALM_FILE_DIR);
      const optionals: any = realm.objects('optional').sorted('integerValue');
      assert.equal(optionals.length, 5);

      // checking null values
      assert.equal(optionals[0].integerValue, null);
      assert.equal(optionals[2].boolValue, null);
      assert.equal(optionals[3].doubleValue, null);
      assert.equal(optionals[4].stringValue, null);
      realm.close();
    });

    it('Import large CSV file', () => {
      // This file should be imported using two write transactions
      // since we're batching inserts every 10000 elements
      const files: string[] = [`${TESTS_PATH}/csv/inspections.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      const realm = csvImporter.import(REALM_FILE_DIR);
      assert.equal(realm.objects('inspections').length, 18480);

      realm.close();
    });

    it('Imports into existing Realm file', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Dog.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      // Open existing Realm file containing schema for Dog, Cat, Owner and DogPromaryKey
      const assetRealm = new Realm(`${TESTS_PATH}/csv/asset_file.realm`);
      assert.equal(assetRealm.schema.length, 4);
      assert.notEqual(
        assetRealm.schema.find(objectSchema => objectSchema.name === 'Dog'),
        undefined,
      );

      assetRealm.beginTransaction();
      assetRealm.delete(assetRealm.objects('Dog'));
      assetRealm.commitTransaction();

      assert.equal(assetRealm.objects('Dog').length, 0);

      csvImporter.importInto(assetRealm);

      // Check new rows were added
      const dogs: any = assetRealm.objects('Dog').sorted('name');
      assert.equal(dogs.length, 2);
      assert.equal(dogs[0].name, 'Caesar');
      assert.equal(dogs[1].name, 'Rex');
      assert.equal(dogs[0].age, 3);
      assert.equal(dogs[1].age, 5);
      assert.equal(dogs[0].height, 6);
      assert.equal(dogs[1].height.toPrecision(3), 3.14);
      assert.equal(dogs[0].weight, 16);
      assert.equal(dogs[1].weight, 17);
      assert.equal(dogs[0].hasTail, true);
      assert.equal(dogs[1].hasTail, false);

      assetRealm.close();
    });

    it('Imports into existing Realm file fails', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

      const schemaGenerator = new ImportSchemaGenerator(
        ImportFormat.CSV,
        files,
      );
      const schema = schemaGenerator.generate();
      const csvImporter = new CSVDataImporter(files, schema);

      // the CSV Cat schema does not corespond to the existing Cat as defined in the Realm
      const assetRealm = new Realm(`${TESTS_PATH}/csv/asset_file.realm`);
      assert.throws(() => csvImporter.importInto(assetRealm), Error);
      assetRealm.close();
    });

    after(() => {
      fs.removeSync(REALM_FILE_DIR);
    });
  });
});
