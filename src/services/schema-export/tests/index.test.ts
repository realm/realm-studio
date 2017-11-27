import * as assert from 'assert';
import fs = require('fs-extra');
import * as Realm from 'realm';
import { Language, SchemaExporter } from '../index';
import { ISchemaExporter } from '../schemaExporter';
import * as modelAll from './models/all/AllTypes';
import * as model from './models/sample/SampleTypes';

const TESTS_PATH = './src/services/schema-export/tests';
const makeRealm = (path: string, schema: Realm.ObjectSchema[]): Realm => {
  return new Realm({
    path,
    schema,
    deleteRealmIfMigrationNeeded: true,
  });
};

const assertGeneratedSchemaIsValid = (
  language: Language,
  expectedFilePath: string,
  generatedFilePath: string,
  realm: Realm,
) => {
  assertGeneratedSchemaAreValid(language, Array<string>(expectedFilePath), Array<string>(generatedFilePath), realm);
};

const assertGeneratedSchemaAreValid = (
  language: Language,
  expectedFilePaths: string[],
  generatedFilePaths: string[],
  realm: Realm,
) => {
  assert.equal(expectedFilePaths.length, generatedFilePaths.length);

  const exporter = SchemaExporter(language);
  exporter.exportSchema(realm);
  exporter.writeFilesToDisk(`${TESTS_PATH}/temporal/${language}`);
  
  for (let i = 0; i < expectedFilePaths.length; i++) {
    const expected = fs.readFileSync(expectedFilePaths[i], 'utf8');
    const generated = fs.readFileSync(generatedFilePaths[i], 'utf8');
    assert.equal(generated, expected);
  }
};

describe('Export schema tests', () => {
  let sampleRealm = {};
  let allRealm = {};

  before(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
    sampleRealm = makeRealm(`${TESTS_PATH}/realms/sample/SampleTypes.realm`, [
      model.SampleTypes
    ]);
    allRealm = makeRealm(`${TESTS_PATH}/realms/all/AllTypes.realm`, [
      modelAll.IndexedTypes,
      modelAll.LinkTypes,
      modelAll.OptionalTypes,
      modelAll.RequiredTypes,
      modelAll.ReverseType
    ]);
  });

  it('JS export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/sample/js/SampleTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/SampleTypes-model.js`,
      sampleRealm as Realm
    );
  });

  it('JS export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/all/js/AllTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/AllTypes-model.js`,
      allRealm as Realm
    );
  });

  it('Swift export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/sample/swift/SampleTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/SampleTypes-model.swift`,
      sampleRealm as Realm
    );
  });

  it('Swift export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/all/swift/AllTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/AllTypes-model.swift`,
      allRealm as Realm
    );
  });

  it('Java export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Java,
      `${TESTS_PATH}/models/sample/java/SampleTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/SampleTypes.java`,
      sampleRealm as Realm
    );
  });

  it('Java exporter model with all types', () => {
    assertGeneratedSchemaAreValid(
      Language.Java,
      Array<string>(
      `${TESTS_PATH}/models/all/java/IndexedTypes.java`,
      `${TESTS_PATH}/models/all/java/LinkTypes.java`,
      `${TESTS_PATH}/models/all/java/OptionalTypes.java`,
      `${TESTS_PATH}/models/all/java/RequiredTypes.java`,
      `${TESTS_PATH}/models/all/java/ReverseType.java`),
      Array<string>(
      `${TESTS_PATH}/temporal/${Language.Java}/IndexedTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/LinkTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/OptionalTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/RequiredTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/ReverseType.java`),
       allRealm as Realm
    );
  });

  after(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
  });
});
