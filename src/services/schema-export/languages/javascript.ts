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

import fsPath from 'path';
import { ISchemaFile, SchemaExporter } from '../schemaExporter';
import { reMapType } from '../utils';

export default class JSSchemaExporter extends SchemaExporter {
  public static propertyLine(prop: any, primaryKey: boolean): string {
    // Name of the type
    let typeStr = '';
    switch (prop.type) {
      case 'list':
      case 'object':
        typeStr = reMapType(prop.objectType);
        break;
      default:
        typeStr = reMapType(prop.type);
    }
    if (prop.optional && prop.type !== 'object') {
      typeStr += '?';
    }
    if (prop.type === 'list') {
      typeStr += '[]';
    }

    // Make line
    let line = prop.name + ': ';
    if (prop.indexed && !primaryKey) {
      line += `{ type: '${typeStr}', indexed: true }`;
    } else {
      line += `'${typeStr}'`;
    }
    return line;
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });
    this.addFile(fsPath.parse(realm.path).name + '-model.js', this.content);

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    this.appendLine(`exports.${schema.name} = {`);
    this.appendLine(`  name: '${schema.name}',`);

    if (schema.primaryKey) {
      this.appendLine(`  primaryKey: '${schema.primaryKey}',`);
    }

    if (schema.embedded) {
      this.appendLine(`  embedded: true,`);
    }

    // properties
    this.appendLine(`  properties: {`);
    (Object.entries(schema.properties) as [
      string,
      Realm.ObjectSchemaProperty,
    ][])
      .filter(([_, prop]) => prop.type !== 'linkingObjects')
      .forEach(([key, prop], idx, arr) => {
        const last = idx === arr.length - 1;
        const primaryKey = key === schema.primaryKey;
        const line = `    ${JSSchemaExporter.propertyLine(prop, primaryKey)}${
          last ? '' : ','
        }`;
        this.appendLine(line);
      });

    this.appendLine('  }\n}\n');
  }
}
