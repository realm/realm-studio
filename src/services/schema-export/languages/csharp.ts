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

import { ISchemaFile, SchemaExporter } from '../schemaExporter';

interface ICSharpProperty {
  attributes: string[];
  mappedTo: string;
  setter: string;
  name: string;
  type: string;

  // public constructor(init?: Partial<CSharpProperty>) {
  //   Object.assign(this, init);
  // }
}

export default class CSharpSchemaExporter extends SchemaExporter {
  private static readonly BacklinkWarning =
    '// Please note : [Backlink] properties and default values are not represented\n// in the schema and thus will not be part of the generated models';
  // private static readonly RealmsNamespace = 'Realms';

  private ClassPadding = '    ';
  private PropertyPadding = this.ClassPadding + this.ClassPadding;

  constructor() {
    super();
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    const properties = new Array<ICSharpProperty>();

    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const prop: any = schema.properties[key];
        // Ignoring 'linkingObjects' https://github.com/realm/realm-js/issues/1519
        // happens only tests, when opening a Realm using schema that includes 'linkingObjects'
        if (prop.type === 'linkingObjects') {
          continue;
        }

        const csharpProperty = {
          name: this.capitalizedString(prop.name),
          mappedTo: prop.name,
          attributes: new Array<string>(),
          setter: ' set;',
          type: '',
        };

        if (prop.name === schema.primaryKey) {
          csharpProperty.attributes.push('PrimaryKey');
        } else if (prop.indexed) {
          csharpProperty.attributes.push('Indexed');
        }

        if (prop.type === 'list') {
          csharpProperty.setter = '';

          const type = this.getCSharpType(
            prop.objectType,
            prop.objectType,
            prop.optional,
            csharpProperty.attributes,
          );

          csharpProperty.type = `IList<${type}>`;
        } else {
          csharpProperty.type = this.getCSharpType(
            prop.type,
            prop.objectType,
            prop.optional,
            csharpProperty.attributes,
          );
        }

        properties.push(csharpProperty);
      }
    }

    this.appendLine(CSharpSchemaExporter.BacklinkWarning);

    this.appendLine('');

    this.appendLine('using System;');
    this.appendLine('using System.Collections.Generic;');
    this.appendLine('using Realms;');

    this.appendLine('');

    this.appendLine('namespace MyProject.Models');
    this.appendLine('{');

    this.appendLine(
      `${this.ClassPadding}public class ${schema.name} : RealmObject`,
    );
    this.appendLine(`${this.ClassPadding}{`);

    let isFirst = true;
    for (const prop of properties) {
      if (isFirst) {
        isFirst = false;
      } else {
        this.appendLine('');
      }

      for (const attribute of prop.attributes) {
        this.appendLine(`${this.PropertyPadding}[${attribute}]`);
      }

      if (prop.mappedTo !== prop.name) {
        this.appendLine(`${this.PropertyPadding}[MapTo("${prop.mappedTo}")]`);
      }

      this.appendLine(
        `${this.PropertyPadding}public ${prop.type} ${prop.name} { get;${
          prop.setter
        } }`,
      );
    }

    this.appendLine(`${this.ClassPadding}}`);
    this.appendLine('}');

    this.addFile(schema.name + '.cs', this.content);

    // reset content for next Schema
    this.content = '';
  }

  private getCSharpType(
    type: string,
    objectType: string,
    isOptional: boolean,
    attributes: string[],
  ): string {
    let isNullable = false;
    let result: string;
    let canBeRequired = true;

    switch (type) {
      case 'bool':
      case 'float':
      case 'double':
        result = type;
        break;
      case 'int':
        result = 'long';
        break;
      case 'date':
        result = 'DateTimeOffset';
        break;
      case 'data':
        result = 'byte[]';
        isNullable = true;
        break;
      case 'string':
        result = 'string';
        isNullable = true;
        break;
      default:
        result = objectType;
        isNullable = true;
        canBeRequired = false;
        break;
    }

    if (isOptional && !isNullable) {
      result += '?';
    } else if (!isOptional && isNullable && canBeRequired) {
      attributes.push('Required');
    }

    return result;
  }
}
