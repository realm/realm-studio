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
import { filteredProperties, isBsonType } from '../utils';

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
    const additionalUsing = new Set<string>();

    filteredProperties(schema.properties).forEach(prop => {
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

      if (isBsonType(prop)) {
        additionalUsing.add('using MongoDB.Bson;');
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
    });

    this.appendLine(CSharpSchemaExporter.BacklinkWarning);

    this.appendLine('');

    this.appendLine('using System;');
    this.appendLine('using System.Collections.Generic;');
    this.appendLine('using Realms;');
    additionalUsing.forEach(using => this.appendLine(using));

    this.appendLine('');

    this.appendLine('namespace MyProject.Models');
    this.appendLine('{');

    this.appendLine(
      `${this.ClassPadding}public class ${schema.name} : ${
        schema.embedded ? 'EmbeddedObject' : 'RealmObject'
      }`,
    );
    this.appendLine(`${this.ClassPadding}{`);

    properties.forEach((prop, idx) => {
      if (idx > 0) {
        this.appendLine('');
      }

      prop.attributes.forEach(attribute =>
        this.appendLine(`${this.PropertyPadding}[${attribute}]`),
      );

      if (prop.mappedTo !== prop.name) {
        this.appendLine(`${this.PropertyPadding}[MapTo("${prop.mappedTo}")]`);
      }

      this.appendLine(
        `${this.PropertyPadding}public ${prop.type} ${prop.name} { get;${prop.setter} }`,
      );
    });

    this.appendLine(`${this.ClassPadding}}`);
    this.appendLine('}');

    this.addFile(schema.name + '.cs', this.content);

    // reset content for next Schema
    this.content = '';
  }

  private getCSharpType(
    type: string | undefined,
    objectType: string | undefined,
    isOptional: boolean | undefined,
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
      case 'object id':
      case 'objectId':
        result = 'ObjectId';
        canBeRequired = false;
        break;
      case 'decimal':
      case 'decimal128':
        result = 'Decimal128';
        canBeRequired = false;
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
        if (!objectType) throw new Error('Missing objectType');

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
