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

export default class KotlinSchemaExporter extends SchemaExporter {
  private static readonly PADDING = '    ';

  private fieldsContent = '';
  private realmImports: Set<string>;

  constructor() {
    super();
    this.fieldsContent = '';
    this.realmImports = new Set<string>();
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    this.appendLine(
      '// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models',
    );
    this.appendLine('package your.package.name.here');
    this.appendLine('');

    this.realmImports.add('import io.realm.RealmObject');

    this.fieldsContent += `open class ${schema.name} : RealmObject() {\n\n`;

    // Properties
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const prop: any = schema.properties[key];
        // Ignoring 'linkingObjects' https://github.com/realm/realm-js/issues/1519
        // happens only tests, when opening a Realm using schema that includes 'linkingObjects'
        if (prop.type === 'linkingObjects') {
          continue;
        }
        this.propertyLine(prop, schema.primaryKey);
        if (prop.indexed && prop.name !== schema.primaryKey) {
          this.realmImports.add('import io.realm.annotations.Index');
        }
        if (!prop.optional && prop.type === 'list') {
          this.realmImports.add('import io.realm.annotations.Required');
        }
      }
    }

    // Primary key
    if (schema.primaryKey) {
      this.realmImports.add('import io.realm.annotations.PrimaryKey');
    }

    // Add all Realm imports
    this.realmImports.forEach(line => {
      this.appendLine(line);
    });
    this.appendLine('');

    // Add class body
    this.appendLine(this.fieldsContent);

    // End class
    this.appendLine('}');

    this.addFile(schema.name + '.kt', this.content);

    // reset content for next Schema
    this.content = '';
    this.fieldsContent = '';
    this.realmImports.clear();
  }

  private propertyLine(prop: any, primaryKey: string | undefined): void {
    if (prop.name === primaryKey) {
      this.fieldsContent += `${KotlinSchemaExporter.PADDING}@PrimaryKey\n`;
    } else if (prop.indexed) {
      this.fieldsContent += `${KotlinSchemaExporter.PADDING}@Index\n`;
    }
    if (!prop.optional && prop.type === 'list') {
      this.fieldsContent += `${KotlinSchemaExporter.PADDING}@Required\n`;
    }
    this.fieldsContent += `${KotlinSchemaExporter.PADDING}var ${
      prop.name
    }: ${this.kotlinTypeForProperty(prop)} ${this.sensibleDefaultForProperty(
      prop,
    )}\n`;
  }

  private sensibleDefaultForProperty(property: any): string {
    const prefix = '=';

    if (property.optional) {
      return `${prefix} null`;
    } else if (property.type === 'list') {
      return `${prefix} RealmList()`;
    } else {
      switch (property.type) {
        case 'bool':
          return `${prefix} false`;
        case 'int':
          return `${prefix} 0`;
        case 'float':
          return `${prefix} 0.0f`;
        case 'double':
          return `${prefix} 0.0`;
        case 'object':
          return `${prefix} ${property.objectType}()`;
        case 'string':
          return `${prefix} ""`;
        case 'data':
          return `${prefix} ByteArray(0)`;
        case 'date':
          return `${prefix} Date()`;
        case 'list':
          return `${prefix} RealmList()`;
      }
    }

    return '';
  }

  private kotlinTypeForProperty(property: any): any {
    let properyType = null;

    if (property.type === 'list') {
      this.realmImports.add('import io.realm.RealmList');
      switch (property.objectType) {
        case 'bool':
          properyType = 'RealmList<Boolean>';
          break;
        case 'int':
          properyType = 'RealmList<Long>';
          break;
        case 'float':
          properyType = 'RealmList<Float>';
          break;
        case 'double':
          properyType = 'RealmList<Double>';
          break;
        case 'string':
          properyType = 'RealmList<String>';
          break;
        case 'data':
          properyType = 'RealmList<ByteArray>';
          break;
        case 'date':
          this.realmImports.add('import java.util.Date');
          properyType = 'RealmList<Date>';
          break;
        default:
          properyType = `RealmList<${property.objectType}>`;
          break;
      }
    } else {
      switch (property.type) {
        case 'bool':
          properyType = 'Boolean';
          break;
        case 'int':
          properyType = 'Long';
          break;
        case 'float':
          properyType = 'Float';
          break;
        case 'double':
          properyType = 'Double';
          break;
        case 'string':
          properyType = 'String';
          break;
        case 'data':
          properyType = 'ByteArray';
          break;
        case 'date':
          this.realmImports.add('import java.util.Date');
          properyType = 'Date';
          break;
        case 'object':
          properyType = property.objectType;
          break;
      }
    }

    if (property.optional) {
      properyType += '?';
    }

    return properyType;
  }
}
