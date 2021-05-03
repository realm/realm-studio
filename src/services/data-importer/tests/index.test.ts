////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import assert from 'assert';
import fs from 'fs-extra';
import { resolve } from 'path';
import { ObjectSchemaProperty } from 'realm';

import { generateSchema, ImportFormat } from '..';
import { CSVDataImporter } from '../csv/CSVDataImporter';
import { ImportableFile } from '../DataImporter';
import Util from '../Util';

const TESTS_PATH = './src/services/data-importer/tests';

describe('Import CSV tests', () => {
  describe('Util helper methods', () => {
    it('parses strings to booleans', () => {
      assert.strictEqual(Util.isBoolean('true'), true);
      assert.strictEqual(Util.isBoolean('TRUE'), true);
      assert.strictEqual(Util.isBoolean('TrUe'), true);

      assert.strictEqual(Util.isBoolean('false'), true);
      assert.strictEqual(Util.isBoolean('FALSE'), true);
      assert.strictEqual(Util.isBoolean('FaLse'), true);

      assert.strictEqual(Util.isBoolean('123'), false);
      assert.strictEqual(Util.isBoolean(' false'), false);
      assert.strictEqual(Util.isBoolean('true '), false);
    });

    it('parses strings to ints', () => {
      assert.strictEqual(Util.isInt('123'), true);
      assert.strictEqual(Util.isInt('3.14'), false);
      assert.strictEqual(Util.isInt('true'), false);
      assert.strictEqual(
        Util.isInt('A094E453-46FD-4F13-AD2F-7333E2C4ABCA'),
        false,
      );
    });

    it('parses strings to doubles', () => {
      assert.strictEqual(Util.isDouble('3.14'), true);
      assert.strictEqual(Util.isDouble('3.0'), true);
      assert.strictEqual(Util.isDouble('3'), true); // always check isInt before isDouble when parsing!
      assert.strictEqual(Util.isDouble('true'), false);
      assert.strictEqual(Util.isDouble('0XCAFEBABE'), false);
    });
  });

  it('Generates a valid Cat schema', () => {
    const files: string[] = [resolve(TESTS_PATH, 'csv/Cat.csv')];

    const schema = generateSchema(ImportFormat.CSV, files);

    assert.strictEqual(schema.length, 1, 'Expected to parse one schema (Cat)');
    const catSchema = schema[0];
    assert.strictEqual(
      catSchema.name,
      'Cat',
      'Expected to parse schema named (Cat)',
    );
    assert.strictEqual(catSchema.properties.name, 'string?');
    assert.strictEqual(catSchema.properties.age, 'int?');
    assert.strictEqual(catSchema.properties.height, 'double?');
    assert.strictEqual(catSchema.properties.weight, 'int?');
    assert.strictEqual(catSchema.properties.hasTail, 'bool?');
    assert.strictEqual(catSchema.properties.birthday, 'string?');
    assert.strictEqual(catSchema.properties.owner, 'string?');
    assert.strictEqual(catSchema.properties.scaredOfDog, 'string?');
  });

  describe('Creating and populating the Realm', () => {
    const REALM_FILE_DIR = resolve(TESTS_PATH, 'temporal');
    const REALM_FILE_PATH = resolve(REALM_FILE_DIR, 'default.realm');

    before(() => {
      fs.removeSync(REALM_FILE_DIR);
      fs.mkdir(REALM_FILE_DIR);
    });

    it('Create a valid Cat Realm file', () => {
      const files: string[] = [resolve(TESTS_PATH, 'csv/Cat.csv')];

      const schema = generateSchema(ImportFormat.CSV, files);

      // open the Realm and make sure the schema matches
      const realm = new Realm({ path: REALM_FILE_PATH, schema });

      assert.strictEqual(
        fs.existsSync(REALM_FILE_PATH),
        true,
        `Realm file was not found at the expected path: ${REALM_FILE_PATH}`,
      );

      assert.strictEqual(
        realm.schema.length,
        1,
        'Expected to find one schema (Cat)',
      );
      const catSchema = realm.schema[0];
      assert.strictEqual(
        catSchema.name,
        'Cat',
        'Expected Schema name to match (Cat)',
      );

      assert.strictEqual(catSchema.properties.hasOwnProperty('name'), true);
      const nameProperty = catSchema.properties.name as ObjectSchemaProperty;
      assert.strictEqual(nameProperty.type, 'string');
      assert.strictEqual(nameProperty.optional, true);
      assert.strictEqual(nameProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('age'), true);
      const ageProperty = catSchema.properties.age as ObjectSchemaProperty;
      assert.strictEqual(ageProperty.type, 'int');
      assert.strictEqual(ageProperty.optional, true);
      assert.strictEqual(ageProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('height'), true);
      const heightProperty = catSchema.properties
        .height as ObjectSchemaProperty;
      assert.strictEqual(heightProperty.type, 'double');
      assert.strictEqual(heightProperty.optional, true);
      assert.strictEqual(heightProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('weight'), true);
      const weightProperty = catSchema.properties
        .weight as ObjectSchemaProperty;
      assert.strictEqual(weightProperty.type, 'int');
      assert.strictEqual(weightProperty.optional, true);
      assert.strictEqual(weightProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('hasTail'), true);
      const hasTailProperty = catSchema.properties
        .hasTail as ObjectSchemaProperty;
      assert.strictEqual(hasTailProperty.type, 'bool');
      assert.strictEqual(hasTailProperty.optional, true);
      assert.strictEqual(hasTailProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('birthday'), true);
      const birthdayProperty = catSchema.properties
        .birthday as ObjectSchemaProperty;
      assert.strictEqual(birthdayProperty.type, 'string');
      assert.strictEqual(birthdayProperty.optional, true);
      assert.strictEqual(birthdayProperty.indexed, false);

      assert.strictEqual(catSchema.properties.hasOwnProperty('owner'), true);
      const ownerProperty = catSchema.properties.owner as ObjectSchemaProperty;
      assert.strictEqual(ownerProperty.type, 'string');
      assert.strictEqual(ownerProperty.optional, true);
      assert.strictEqual(ownerProperty.indexed, false);

      assert.strictEqual(
        catSchema.properties.hasOwnProperty('scaredOfDog'),
        true,
      );
      const scaredOfDogProperty = catSchema.properties
        .scaredOfDog as ObjectSchemaProperty;
      assert.strictEqual(scaredOfDogProperty.type, 'string');
      assert.strictEqual(scaredOfDogProperty.optional, true);
      assert.strictEqual(scaredOfDogProperty.indexed, false);

      realm.close();
    });

    it('Populate a valid Cat Realm file', () => {
      const files: ImportableFile[] = [
        { path: resolve(TESTS_PATH, 'csv/Cat.csv'), className: 'Cat' },
      ];

      const schema = generateSchema(
        ImportFormat.CSV,
        files.map(f => f.path),
      );
      const realm = new Realm({ path: REALM_FILE_PATH, schema });
      const csvImporter = new CSVDataImporter();
      csvImporter.import(realm, files);

      const cats = realm.objects('Cat').sorted('name');
      assert.strictEqual(cats.length, 2);
      let cat = cats[0] as any;
      assert.strictEqual(cat.name, 'Kitty');
      assert.strictEqual(cat.age, 3);
      assert.strictEqual(cat.height, 22.1);
      assert.strictEqual(cat.weight, 0);
      assert.strictEqual(cat.hasTail, false);
      assert.strictEqual(cat.birthday, '<null>');
      assert.strictEqual(cat.owner, '<null>');
      assert.strictEqual(cat.scaredOfDog, '<null>');

      cat = cats[1] as any;
      assert.strictEqual(cat.name, 'Ninneko');
      assert.strictEqual(cat.age, 4);
      assert.strictEqual(cat.height, 21.0);
      assert.strictEqual(cat.weight, 0);
      assert.strictEqual(cat.hasTail, true);
      assert.strictEqual(cat.birthday, '<null>');
      assert.strictEqual(cat.owner, '<null>');
      assert.strictEqual(cat.scaredOfDog, '<null>');

      realm.close();
    });

    it('Invalid CSV should not generate a Realm file', () => {
      // the types of the generated Realm are infered automatically from the first line
      // of the CSV, if the subsequent lines contains data that doesn't match the schema
      // the parsing will stop and the empty file will be removed.
      const files: ImportableFile[] = [
        {
          path: resolve(TESTS_PATH, 'csv/invalid_second_line.csv'),
          className: 'invalid_second_line',
        },
      ];

      const schema = generateSchema(
        ImportFormat.CSV,
        files.map(f => f.path),
      );
      const csvImporter = new CSVDataImporter();

      const realm = new Realm({ path: REALM_FILE_PATH, schema });
      assert.throws(() => csvImporter.import(realm, files), Error);
      realm.close();
    });

    it('Multiple CSV should generate one Realm file', () => {
      const files: ImportableFile[] = [
        { path: resolve(TESTS_PATH, 'csv/dogs.csv'), className: 'dogs' },
        { path: resolve(TESTS_PATH, 'csv/people.csv'), className: 'people' },
      ];

      const schema = generateSchema(
        ImportFormat.CSV,
        files.map(f => f.path),
      );
      const realm = new Realm({ path: REALM_FILE_PATH, schema });
      const csvImporter = new CSVDataImporter();
      csvImporter.import(realm, files);

      const people = realm.objects('people');
      const dogs = realm.objects('dogs');
      assert.strictEqual(people.length, 2);
      assert.strictEqual(dogs.length, 2);
      realm.close();
    });

    it('Parsing should support optional values', () => {
      const files: ImportableFile[] = [
        {
          path: resolve(TESTS_PATH, 'csv/optional.csv'),
          className: 'optional',
        },
      ];

      const schema = generateSchema(
        ImportFormat.CSV,
        files.map(f => f.path),
      );

      const realm = new Realm({ path: REALM_FILE_PATH, schema });
      const csvImporter = new CSVDataImporter();
      csvImporter.import(realm, files);

      const optionals: any = realm.objects('optional').sorted('integerValue');
      assert.strictEqual(optionals.length, 5);

      // checking null values
      assert.strictEqual(optionals[0].integerValue, null);
      assert.strictEqual(optionals[2].boolValue, null);
      assert.strictEqual(optionals[3].doubleValue, null);
      assert.strictEqual(optionals[4].stringValue, null);
      realm.close();
    });

    it('Import large CSV file', () => {
      // This file should be imported using two write transactions
      // since we're batching inserts every 10000 elements
      const files: ImportableFile[] = [
        {
          path: resolve(TESTS_PATH, 'csv/inspections.csv'),
          className: 'inspections',
        },
      ];

      const schema = generateSchema(
        ImportFormat.CSV,
        files.map(f => f.path),
      );
      const csvImporter = new CSVDataImporter();
      const realm = new Realm({ path: REALM_FILE_PATH, schema });

      csvImporter.import(realm, files);
      assert.strictEqual(realm.objects('inspections').length, 18480);

      realm.close();
    }).timeout(10000); // ensure safe timeout for the test to finish in CI.

    it('Imports into existing Realm file', () => {
      const files: ImportableFile[] = [
        { path: resolve(TESTS_PATH, 'csv/Dog.csv'), className: 'Dog' },
      ];

      const csvImporter = new CSVDataImporter();

      const originalPath = resolve(TESTS_PATH, 'csv/asset_file.realm');
      const temporaryPath = resolve(REALM_FILE_DIR, 'asset_file.realm');
      fs.copyFileSync(originalPath, temporaryPath);

      // Open existing Realm file containing schema for Dog, Cat, Owner and DogPromaryKey
      const assetRealm = new Realm({ path: temporaryPath });
      assert.strictEqual(assetRealm.schema.length, 4);
      assert.notStrictEqual(
        assetRealm.schema.find(objectSchema => objectSchema.name === 'Dog'),
        undefined,
      );

      assetRealm.beginTransaction();
      assetRealm.delete(assetRealm.objects('Dog'));
      assetRealm.commitTransaction();

      assert.strictEqual(assetRealm.objects('Dog').length, 0);

      csvImporter.import(assetRealm, files);

      // Check new rows were added
      const dogs: any = assetRealm.objects('Dog').sorted('name');
      assert.strictEqual(dogs.length, 2);
      assert.strictEqual(dogs[0].name, 'Caesar');
      assert.strictEqual(dogs[1].name, 'Rex');
      assert.strictEqual(dogs[0].age, 3);
      assert.strictEqual(dogs[1].age, 5);
      assert.strictEqual(dogs[0].height, 6);
      assert.strictEqual(dogs[1].height.toPrecision(3), '3.14');
      assert.strictEqual(dogs[0].weight, 16);
      assert.strictEqual(dogs[1].weight, 17);
      assert.strictEqual(dogs[0].hasTail, true);
      assert.strictEqual(dogs[1].hasTail, false);

      assetRealm.close();
    });

    it('Imports into existing Realm file fails', () => {
      const files: ImportableFile[] = [
        { path: resolve(TESTS_PATH, 'csv/Cat.csv'), className: 'Cat' },
      ];

      const csvImporter = new CSVDataImporter();

      // the CSV Cat schema does not corespond to the existing Cat as defined in the Realm
      const assetRealm = new Realm({
        path: resolve(TESTS_PATH, 'csv/asset_file.realm'),
        readOnly: true,
      });
      assert.throws(() => csvImporter.import(assetRealm, files), Error);
      assetRealm.close();
    });

    after(() => {
      fs.removeSync(REALM_FILE_DIR);
    });
  });
});
