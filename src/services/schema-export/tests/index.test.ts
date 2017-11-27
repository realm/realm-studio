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
  assertGeneratedSchemaAreValid(
    language,
    Array<string>(expectedFilePath),
    Array<string>(generatedFilePath),
    realm,
  );
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
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/sample/js/SampleTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/SampleTypes-model.js`,
      sampleRealm as Realm,
    );
  });

  it('JS export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/all/js/AllTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/AllTypes-model.js`,
      allRealm as Realm,
    );
  });

  it('Swift export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/sample/swift/SampleTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/SampleTypes-model.swift`,
      sampleRealm as Realm,
    );
  });

  it('Swift export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/all/swift/AllTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/AllTypes-model.swift`,
      allRealm as Realm,
    );
  });

  it('Java export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Java,
      `${TESTS_PATH}/models/sample/java/SampleTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/SampleTypes.java`,
      sampleRealm as Realm,
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
        `${TESTS_PATH}/models/all/java/ReverseType.java`,
      ),
      Array<string>(
        `${TESTS_PATH}/temporal/${Language.Java}/IndexedTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/LinkTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/OptionalTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/RequiredTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/ReverseType.java`,
      ),
      allRealm as Realm,
    );
  });

  it('C# exporter model with sample types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/sample/cs/SampleTypes.cs`,
      'utf8',
    );
    exp = SchemaExporter(Language.CS);

    exp.exportSchema(sampleRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.CS}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/SampleTypes.cs`,
      'utf8',
    );
    assert.equal(generated, expected);
  });

  it('C# exporter model with all types', () => {
    const expectedIndexedTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/cs/IndexedTypes.cs`,
      'utf8',
    );
    const expectedLinkTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/cs/LinkTypes.cs`,
      'utf8',
    );
    const expectedOptionalTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/cs/OptionalTypes.cs`,
      'utf8',
    );
    const expectedRequiredTypes = fs.readFileSync(
      `${TESTS_PATH}/models/all/cs/RequiredTypes.cs`,
      'utf8',
    );
    const expectedReverseType = fs.readFileSync(
      `${TESTS_PATH}/models/all/cs/ReverseType.cs`,
      'utf8',
    );
    exp = SchemaExporter(Language.CS);

    exp.exportSchema(allRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.CS}`);
    const generatedIndexedTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/IndexedTypes.cs`,
      'utf8',
    );
    const generatedLinkTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/LinkTypes.cs`,
      'utf8',
    );
    const generatedOptionalTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/OptionalTypes.cs`,
      'utf8',
    );
    const generatedRequiredTypes = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/RequiredTypes.cs`,
      'utf8',
    );
    const generatedReverseType = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.CS}/ReverseType.cs`,
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
