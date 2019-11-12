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

export default class SwiftSchemaExporter extends SchemaExporter {
  constructor() {
    super();
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    this.appendLine('import Foundation');
    this.appendLine('import RealmSwift\n');

    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });
    this.addFile(fsPath.parse(realm.path).name + '-model.swift', this.content);

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    this.appendLine(`class ${schema.name}: Object {`);

    // Properties
    const indexedProp = [];
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const prop: any = schema.properties[key];
        // Ignoring 'linkingObjects' https://github.com/realm/realm-js/issues/1519
        // happens only tests, when opening a Realm using schema that includes 'linkingObjects'
        if (prop.type === 'linkingObjects') {
          continue;
        }
        this.appendLine('    ' + this.propertyLine(prop));
        if (prop.indexed && prop.name !== schema.primaryKey) {
          indexedProp.push(prop);
        }
      }
    }

    // Primary key
    if (schema.primaryKey) {
      this.appendLine('');
      this.appendLine('    override static func primaryKey() -> String? {');
      this.appendLine('        return "' + schema.primaryKey + '"');
      this.appendLine('    }');
    }

    // Indexed Properties
    if (indexedProp.length > 0) {
      this.appendLine('');
      this.appendLine(
        '    override static func indexedProperties() -> [String] {',
      );

      let line = '        return [';
      let prop: any;
      for (let i = 0; i < indexedProp.length; i++) {
        prop = indexedProp[i];
        line += `"${prop.name}"`;
        if (i < indexedProp.length - 1) {
          line += ', ';
        }
      }
      this.appendLine(line + ']');
      this.appendLine('    }');
    }

    // End class
    this.appendLine('}');
    this.appendLine('');
  }

  public propertyLine(prop: any): string | undefined {
    function propertyType(type: string) {
      switch (type) {
        case 'bool':
          return 'Bool';
        case 'int':
          return 'Int';
        case 'float':
          return 'Float';
        case 'double':
          return 'Double';
        case 'string':
          return 'String';
        case 'data':
          return 'Data';
        case 'date':
          return 'Date';
      }
      return type;
    }

    // Arrays
    if (prop.type === 'list') {
      let strArray = propertyType(prop.objectType);
      if (prop.optional) {
        strArray += '?';
      }
      return `let ${prop.name} = List<${strArray}>()`;
    }

    const propType = propertyType(prop.type);

    // Optional types
    if (prop.optional) {
      switch (prop.type) {
        case 'bool':
        case 'int':
        case 'float':
        case 'double':
          return `let ${prop.name} = RealmOptional<${propType}>()`;

        case 'string':
        case 'data':
        case 'date':
          return `@objc dynamic var ${prop.name}: ${propType}? = nil`;

        case 'object':
          return `@objc dynamic var ${prop.name}: ${prop.objectType}?`;
        default:
          return `ERROR - unknown type '${prop.type}'`;
      }
    }

    // Non Optional types
    const str = `@objc dynamic var ${prop.name}: ${propType} = `;
    switch (prop.type) {
      case 'bool':
        return str + 'false';
      case 'int':
      case 'float':
      case 'double':
        return str + '0';
      case 'string':
        return str + '""';
      case 'data':
        return str + 'Data()';
      case 'date':
        return str + 'Date()';
      case 'object':
        return 'Objects must always be optional. Something is not right in this model!';
    }
  }
}
