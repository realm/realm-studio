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
import Realm from 'realm';
import { Language, SchemaExporter } from '../index';

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
  let sampleRealm: Realm;
  let allRealm: Realm;

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
      modelAll.ParentEmbeddedType,
      modelAll.ChildEmbeddedType,
    ]);
  });

  it('JS export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/sample/js/SampleTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/SampleTypes-model.js`,
      sampleRealm,
    );
  });

  it('JS export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.JS,
      `${TESTS_PATH}/models/all/js/AllTypes.js`,
      `${TESTS_PATH}/temporal/${Language.JS}/AllTypes-model.js`,
      allRealm,
    );
  });

  it('TS export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.TS,
      `${TESTS_PATH}/models/sample/ts/SampleTypes.ts.unformatted`,
      `${TESTS_PATH}/temporal/${Language.TS}/SampleTypes-model.ts`,
      sampleRealm,
    );
  });

  it('TS export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.TS,
      `${TESTS_PATH}/models/all/ts/AllTypes.ts.unformatted`,
      `${TESTS_PATH}/temporal/${Language.TS}/AllTypes-model.ts`,
      allRealm,
    );
  });

  it('Swift export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/sample/swift/SampleTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/SampleTypes-model.swift`,
      sampleRealm,
    );
  });

  it('Swift export with all types', () => {
    assertGeneratedSchemaIsValid(
      Language.Swift,
      `${TESTS_PATH}/models/all/swift/AllTypes.swift`,
      `${TESTS_PATH}/temporal/${Language.Swift}/AllTypes-model.swift`,
      allRealm,
    );
  });

  it('Java export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Java,
      `${TESTS_PATH}/models/sample/java/SampleTypes.java`,
      `${TESTS_PATH}/temporal/${Language.Java}/SampleTypes.java`,
      sampleRealm,
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
        `${TESTS_PATH}/models/all/java/ChildEmbeddedType.java`,
        `${TESTS_PATH}/models/all/java/ParentEmbeddedType.java`,
      ),
      Array<string>(
        `${TESTS_PATH}/temporal/${Language.Java}/IndexedTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/LinkTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/OptionalTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/RequiredTypes.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/ReverseType.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/ChildEmbeddedType.java`,
        `${TESTS_PATH}/temporal/${Language.Java}/ParentEmbeddedType.java`,
      ),
      allRealm,
    );
  });

  it('Kotlin export with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.Kotlin,
      `${TESTS_PATH}/models/sample/kotlin/SampleTypes.kt`,
      `${TESTS_PATH}/temporal/${Language.Kotlin}/SampleTypes.kt`,
      sampleRealm,
    );
  });

  it('Kotlin exporter model with all types', () => {
    assertGeneratedSchemaAreValid(
      Language.Kotlin,
      Array<string>(
        `${TESTS_PATH}/models/all/kotlin/IndexedTypes.kt`,
        `${TESTS_PATH}/models/all/kotlin/LinkTypes.kt`,
        `${TESTS_PATH}/models/all/kotlin/OptionalTypes.kt`,
        `${TESTS_PATH}/models/all/kotlin/RequiredTypes.kt`,
        `${TESTS_PATH}/models/all/kotlin/ReverseType.kt`,
        `${TESTS_PATH}/models/all/kotlin/ChildEmbeddedType.kt`,
        `${TESTS_PATH}/models/all/kotlin/ParentEmbeddedType.kt`,
      ),
      Array<string>(
        `${TESTS_PATH}/temporal/${Language.Kotlin}/IndexedTypes.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/LinkTypes.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/OptionalTypes.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/RequiredTypes.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/ReverseType.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/ChildEmbeddedType.kt`,
        `${TESTS_PATH}/temporal/${Language.Kotlin}/ParentEmbeddedType.kt`,
      ),
      allRealm,
    );
  });

  it('C# exporter model with sample types', () => {
    assertGeneratedSchemaIsValid(
      Language.CS,
      `${TESTS_PATH}/models/sample/cs/SampleTypes.cs`,
      `${TESTS_PATH}/temporal/${Language.CS}/SampleTypes.cs`,
      sampleRealm,
    );
  });

  it('C# exporter model with all types', () => {
    assertGeneratedSchemaAreValid(
      Language.CS,
      Array<string>(
        `${TESTS_PATH}/models/all/cs/IndexedTypes.cs`,
        `${TESTS_PATH}/models/all/cs/LinkTypes.cs`,
        `${TESTS_PATH}/models/all/cs/OptionalTypes.cs`,
        `${TESTS_PATH}/models/all/cs/RequiredTypes.cs`,
        `${TESTS_PATH}/models/all/cs/ReverseType.cs`,
        `${TESTS_PATH}/models/all/cs/ChildEmbeddedType.cs`,
        `${TESTS_PATH}/models/all/cs/ParentEmbeddedType.cs`,
      ),
      Array<string>(
        `${TESTS_PATH}/temporal/${Language.CS}/IndexedTypes.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/LinkTypes.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/OptionalTypes.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/RequiredTypes.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/ReverseType.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/ChildEmbeddedType.cs`,
        `${TESTS_PATH}/temporal/${Language.CS}/ParentEmbeddedType.cs`,
      ),
      allRealm,
    );
  });

  after(() => {
    fs.removeSync(`${TESTS_PATH}/realms`);
    fs.removeSync(`${TESTS_PATH}/temporal`);
  });
});
