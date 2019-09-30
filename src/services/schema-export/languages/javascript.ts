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

import * as fsPath from 'path';
import { ISchemaFile, SchemaExporter } from '../schemaExporter';

export default class JSSchemaExporter extends SchemaExporter {
  public static propertyLine(prop: any, primaryKey: boolean): string {
    // Name of the type
    let typeStr = '';
    switch (prop.type) {
      case 'list':
      case 'object':
        typeStr = prop.objectType;
        break;
      default:
        typeStr = prop.type;
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

    // properties
    this.appendLine(`  properties: {`);
    let i = 1;
    const lastIdx = Object.keys(schema.properties).length;
    let line: string;
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const primaryKey = key === schema.primaryKey;
        const prop: any = schema.properties[key];
        // Ignoring 'linkingObjects' https://github.com/realm/realm-js/issues/1519
        // happens only tests, when opening a Realm using schema that includes 'linkingObjects'
        if (prop.type === 'linkingObjects') {
          continue;
        }
        line = '    ' + JSSchemaExporter.propertyLine(prop, primaryKey);
        if (i++ < lastIdx) {
          line += ',';
        }
        this.appendLine(line);
      }
    }

    this.appendLine('  }\n}\n');
  }
}
