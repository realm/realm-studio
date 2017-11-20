import * as assert from 'assert';
import fs = require('fs-extra');
import * as Realm from 'realm';
import { Language, SchemaExporter } from '../index';

const TESTS_PATH = './src/services/schema-export/src/tests';

describe('Export schema tests', () => {
  let realm: Realm;

  before(() => {
    fs.removeSync(`${TESTS_PATH}/generatedSchemas`);
    realm = new Realm({ path: `${TESTS_PATH}/demo.realm` });
  });

  it('JS exporter', () => {
    const expectedSchema = fs.readFileSync(
      `${TESTS_PATH}/demo-model.js`,
      'utf8',
    );
    const exp = SchemaExporter(Language.JS);
    exp.exportSchema(realm);
    exp.writeFilesToDisk(`${TESTS_PATH}/generatedSchemas/${Language.JS}`);
    const generatedSchema = fs.readFileSync(
      `${TESTS_PATH}/generatedSchemas/${Language.JS}/demo-model.js`,
      'utf8',
    );
    assert.equal(expectedSchema, generatedSchema);
  });

  it('Swift exporter', () => {
    const expectedSchema = fs.readFileSync(
      `${TESTS_PATH}/demo-model.swift`,
      'utf8',
    );
    const exp = SchemaExporter(Language.Swift);
    exp.exportSchema(realm);
    exp.writeFilesToDisk(`${TESTS_PATH}/generatedSchemas/${Language.Swift}`);
    const generatedSchema = fs.readFileSync(
      `${TESTS_PATH}/generatedSchemas/${Language.Swift}/demo-model.swift`,
      'utf8',
    );
    assert.equal(expectedSchema, generatedSchema);
  });

  after(() => {
    fs.removeSync(`${TESTS_PATH}/generatedSchemas`);
  });
});
