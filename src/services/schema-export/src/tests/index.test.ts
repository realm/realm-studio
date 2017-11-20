import * as assert from 'assert';
import fs = require('fs-extra');
import * as Realm from 'realm';
import { Language, SchemaExporter } from '../index';
import { ISchemaExporter } from '../schemaExporter';
import * as models1 from './models/sample/SampleTypes';

const TESTS_PATH = './src/services/schema-export/src/tests';

const makeRealm = (path: string, schema: Realm.ObjectSchema[]): Realm => {
  return new Realm({
    path,
    schema,
    deleteRealmIfMigrationNeeded: true,
  });
};

describe('Export schema tests', () => {
  let sampleRealm: Realm;
  let exp: ISchemaExporter;

  before(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
    sampleRealm = makeRealm(`${TESTS_PATH}/realms/sample/SampleTypes.realm`, [
      models1.SampleTypes,
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
    assert.equal(expected, generated);
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

  after(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
  });
});
