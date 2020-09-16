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
import JSSchemaExporter from './javascript';

interface INamedObjectSchemaProperty extends Realm.ObjectSchemaProperty {
  name: string;
}

export default class TSSchemaExporter extends SchemaExporter {
  public exportSchema(realm: Realm): ISchemaFile[] {
    this.appendLine('import * as Realm from "realm";\n');

    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });

    const schemaNames = realm.schema.map(schema => schema.name + 'Schema');
    this.appendLine(`export const Schema = [${schemaNames.join(', ')}];`);

    this.addFile(fsPath.parse(realm.path).name + '-model.ts', this.content);

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    // TypeScript Type

    this.appendLine(`export type ${schema.name} = {`);
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const prop = schema.properties[key] as INamedObjectSchemaProperty;
        // Ignoring 'linkingObjects' https://github.com/realm/realm-js/issues/1519
        // happens only tests, when opening a Realm using schema that includes 'linkingObjects'
        if (prop.type === 'linkingObjects') {
          continue;
        }
        this.appendLine('  ' + this.propertyLine(prop));
      }
    }
    this.appendLine(`};\n`);

    // JavaScript Schema

    this.appendLine(`export const ${schema.name}Schema = {`);
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
      INamedObjectSchemaProperty,
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

    this.appendLine('  }\n};\n');
  }

  /**
   * Maps from a singular Realm type to a TypeScript type.
   * @see https://realm.io/docs/javascript/latest/#supported-types
   * @param prop The property to produce a TypeScript type for.
   */
  public getTypeFromPropertyType(type: Realm.PropertyType | undefined) {
    switch (type) {
      case 'bool':
        return 'boolean';
      case 'int':
      case 'float':
      case 'double':
        return 'number';
      case 'data':
        return 'ArrayBuffer';
      case 'date':
        return 'Date';
      case 'object id':
      case 'objectId':
        return 'Realm.ObjectId';
      case 'decimal':
      case 'decimal128':
        return 'Realm.Decimal128';
      default:
        return type;
    }
  }

  /**
   * Maps from the Realm type to a TypeScript type.
   * @see https://realm.io/docs/javascript/latest/#supported-types
   * @param prop The property to produce a TypeScript type for.
   */
  public getTypeFromProperty(prop: Realm.ObjectSchemaProperty) {
    // console.log(prop.type, this.getTypeFromPropertyType(prop.objectType));
    if (prop.type === 'list') {
      const typeStr = this.getTypeFromPropertyType(prop.objectType);
      return `Array<${typeStr}${prop.optional ? ' | undefined' : ''}>`;
    } else if (prop.type === 'object') {
      return this.getTypeFromPropertyType(prop.objectType);
    } else {
      return this.getTypeFromPropertyType(prop.type);
    }
  }

  public propertyLine(prop: INamedObjectSchemaProperty): string {
    return (
      prop.name +
      (prop.optional && prop.type !== 'list' ? '?' : '') +
      ': ' +
      this.getTypeFromProperty(prop) +
      ';'
    );
  }
}
