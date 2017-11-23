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

const test = (
  language: Language,
  expectedFilePath: string,
  generatedFilePath: string,
  realm: Realm,
) => {
  const expected = fs.readFileSync(expectedFilePath, 'utf8');
  const exporter = SchemaExporter(language);
  exporter.exportSchema(realm);
  exporter.writeFilesToDisk(`${TESTS_PATH}/temporal/${language}`);
  const generated = fs.readFileSync(
    `${TESTS_PATH}/temporal/${language}/${generatedFilePath}`,
    'utf8',
  );
  assert.equal(generated, expected);
};

describe('Export schema tests', () => {
  let sampleRealm = {};
  let allRealm = {};

  before(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
    sampleRealm = makeRealm(`${TESTS_PATH}/realms/sample/SampleTypes.realm`, [
      model.SampleTypes,
    ]);
    allRealm = makeRealm(`${TESTS_PATH}/realms/all/AllTypes.realm`, [
      modelAll.IndexedTypes,
      modelAll.LinkTypes,
      modelAll.OptionalTypes,
      modelAll.RequiredTypes,
      modelAll.ReverseType,
    ]);
  });

  it('JS export with sample types', () => {
    test(
      Language.JS,
      `${TESTS_PATH}/models/sample/js/SampleTypes.js`,
      'SampleTypes-model.js',
      sampleRealm as Realm,
    );
  });

  it('JS export with all types', () => {
    test(
      Language.JS,
      `${TESTS_PATH}/models/all/js/AllTypes.js`,
      'AllTypes-model.js',
      allRealm as Realm,
    );
  });

  it('Swift export with sample types', () => {
    test(
      Language.Swift,
      `${TESTS_PATH}/models/sample/swift/SampleTypes.swift`,
      'SampleTypes-model.swift',
      sampleRealm as Realm,
    );
  });

  it('Swift export with all types', () => {
    test(
      Language.Swift,
      `${TESTS_PATH}/models/all/swift/AllTypes.swift`,
      'AllTypes-model.swift',
      allRealm as Realm,
    );
  });

  it('Java export with sample types', () => {
    test(
      Language.Java,
      `${TESTS_PATH}/models/sample/java/SampleTypes.java`,
      'SampleTypes.java',
      sampleRealm as Realm,
    );
  });

  it('Java exporter model with all types', () => {
    const expectedIndexedTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/java/IndexedTypes.java`,
      'utf8',
    );
    const expectedLinkTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/java/LinkTypes.java`,
      'utf8',
    );
    const expectedOptionalTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/java/OptionalTypes.java`,
      'utf8',
    );
    const expectedRequiredTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/java/RequiredTypes.java`,
      'utf8',
    );
    const expectedReverseType = fs.readFileSync(
      `${TESTS_PATH}/models/all/java/ReverseType.java`,
      'utf8',
    );

    const exp: ISchemaExporter = SchemaExporter(Language.Java);
    exp.exportSchema(allRealm as Realm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.Java}`);

    const generatedIndexedTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/IndexedTypes.java`,
      'utf8',
    );
    const generatedLinkTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/LinkTypes.java`,
      'utf8',
    );
    const generatedOptionalTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/OptionalTypes.java`,
      'utf8',
    );
    const generatedRequiredTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/RequiredTypes.java`,
      'utf8',
    );
    const generatedReverseType = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/ReverseType.java`,
      'utf8',
    );
    assert.equal(generatedIndexedTypes, expectedIndexedTypes);
    assert.equal(generatedLinkTypes, expectedLinkTypes);
    assert.equal(generatedOptionalTypes, expectedOptionalTypes);
    assert.equal(generatedRequiredTypes, expectedRequiredTypes);
    assert.equal(generatedReverseType, expectedReverseType);
  });

  after(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
  });
});
