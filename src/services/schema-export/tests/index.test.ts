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

describe('Export schema tests', () => {
  let sampleRealm: Realm;
  let allRealm: Realm;
  let exp: ISchemaExporter;

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

  it('JS exporter model with sample types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/sample/js/SampleTypes.js`,
      'utf8',
    );
    exp = SchemaExporter(Language.JS);
    exp.exportSchema(sampleRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.JS}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.JS}/SampleTypes-model.js`,
      'utf8',
    );
    assert.equal(generated, expected);
  });

  it('JS exporter model with all types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/all/js/AllTypes.js`,
      'utf8',
    );
    exp = SchemaExporter(Language.JS);
    exp.exportSchema(allRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.JS}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.JS}/AllTypes-model.js`,
      'utf8',
    );
    assert.equal(generated, expected);
  });

  it('Swift exporter model with sample types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/sample/swift/SampleTypes.swift`,
      'utf8',
    );
    exp = SchemaExporter(Language.Swift);

    exp.exportSchema(sampleRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.Swift}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Swift}/SampleTypes-model.swift`,
      'utf8',
    );
    assert.equal(expected, generated);
  });

  it('Swift exporter model with all types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/all/swift/AllTypes.swift`,
      'utf8',
    );
    exp = SchemaExporter(Language.Swift);

    exp.exportSchema(allRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.Swift}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Swift}/AllTypes-model.swift`,
      'utf8',
    );
    assert.equal(expected, generated);
  });

  it('Java exporter model with sample types', () => {
    const expected = fs.readFileSync(
      `${TESTS_PATH}/models/sample/java/SampleTypes.java`,
      'utf8',
    );
    exp = SchemaExporter(Language.Java);

    exp.exportSchema(sampleRealm);
    exp.writeFilesToDisk(`${TESTS_PATH}/temporal/${Language.Java}`);
    const generated = fs.readFileSync(
      `${TESTS_PATH}/temporal/${Language.Java}/SampleTypes.java`,
      'utf8',
    );
    assert.equal(generated, expected);
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
    exp = SchemaExporter(Language.Java);

    exp.exportSchema(allRealm);
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
