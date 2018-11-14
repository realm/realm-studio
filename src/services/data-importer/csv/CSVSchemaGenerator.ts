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

import * as fs from 'fs-extra';
import * as papaparse from 'papaparse';
import { basename, extname } from 'path';

import { ImportObjectSchema } from '../ImportObjectSchema';
import { SchemaGenerator } from '../SchemaGenerator';
import Util from '../Util';

/**
 * Will analyze the contents of files provided to it, and intelligently
 * generate a schema definition object with which the structure of a Realm file can be created.
 *
 * This is then used to map the raw data to the appropriate properties when performing the import to Realm.
 */
export class CSVSchemaGenerator extends SchemaGenerator {
  public generate(): Realm.ObjectSchema[] {
    const schemas = Array<Realm.ObjectSchema>();

    this.paths.map(path => {
      const name = basename(path, extname(path));
      const schema = new ImportObjectSchema(name);
      let rawCSV = fs.readFileSync(path, 'utf8');

      // Read header only
      const content = papaparse.parse(rawCSV, {
        header: true,
        preview: 1,
      });
      rawCSV = '';
      const headers: string[] = content.meta.fields;
      const data: any[] = content.data;
      headers.forEach(header => {
        const value: string = data[0][header];
        schema.properties[header] = Util.isBoolean(value)
          ? 'bool?'
          : Util.isInt(value)
          ? 'int?'
          : Util.isDouble(value)
          ? 'double?'
          : 'string?';
      });
      schemas.push(schema);
    });
    return schemas;
  }
}
