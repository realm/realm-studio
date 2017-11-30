import * as assert from 'assert';
import fs = require('fs-extra');
import { ObjectSchemaProperty } from 'realm';
import CSVDataImporter from '../csv/CSVDataImporter';
import { DataImporterHelper, ImportSchemaFormat } from '../index';
import Util from '../Util';

const TESTS_PATH = './src/services/data-importer/tests';

describe('Import CSV tests', () => {
  it('Util helper methods', () => {
    it('parse boolean', () => {
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

    it('parse int', () => {
      assert.equal(Util.isInt('123'), true);
      assert.equal(Util.isInt('3.14'), false);
      assert.equal(Util.isInt('true'), false);
    });

    it('parse double', () => {
      assert.equal(Util.isDouble('3.14'), true);
      assert.equal(Util.isDouble('3.0'), true);
      assert.equal(Util.isDouble('3'), true); // always check isInt before isDouble when parsing!
      assert.equal(Util.isDouble('true'), false);
      assert.equal(Util.isDouble('0XCAFEBABE'), false);
    });
  });

  it('Generate a valid Cat schema', () => {
    const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

    const importer = DataImporterHelper(ImportSchemaFormat.CSV, files);
    const importSchema = importer.generate();

    assert.equal(importSchema.length, 1, 'Expected to parse one schema (Cat)');
    const catSchema = importSchema[0];
    assert.equal(catSchema.name, 'Cat', 'Expected to parse schema named (Cat)');
    assert.equal(catSchema.properties.name, 'string?'); // FIXME compare against camelized names
    assert.equal(catSchema.properties.age, 'int?');
    assert.equal(catSchema.properties.height, 'double?');
    assert.equal(catSchema.properties.weight, 'int?');
    assert.equal(catSchema.properties.hasTail, 'bool?');
    assert.equal(catSchema.properties.birthday, 'string?');
    assert.equal(catSchema.properties.owner, 'string?');
    assert.equal(catSchema.properties.scaredOfDog, 'string?');
  });

  describe('Create and populate the Realm', () => {
    before(() => {
      fs.removeSync(`${TESTS_PATH}/temporal`);
      fs.mkdir(`${TESTS_PATH}/temporal`);
    });

    it('Create a valid Cat Realm file', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

      const importer = DataImporterHelper(ImportSchemaFormat.CSV, files);
      const importSchema = importer.generate();
      const csvImporter = new CSVDataImporter(files);

      const REALM_FILE_DIR = `${TESTS_PATH}/temporal`;

      csvImporter.createNewRealmFile(REALM_FILE_DIR, importSchema);

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
    });

    it('Populate a valid Cat Realm file', () => {
      const files: string[] = [`${TESTS_PATH}/csv/Cat.csv`];

      const importer = DataImporterHelper(ImportSchemaFormat.CSV, files);
      const importSchema = importer.generate();
      const csvImporter = new CSVDataImporter(files);

      const REALM_FILE_DIR = `${TESTS_PATH}/temporal`;

      const realm = csvImporter.import(REALM_FILE_DIR, importSchema);
    });

    after(() => {
      fs.removeSync(`${TESTS_PATH}/temporal`);
    });
  });
});
