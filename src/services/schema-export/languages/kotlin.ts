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
import { filteredProperties, isPrimitive } from '../utils';

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

    if (schema.embedded) {
      this.realmImports.add('import io.realm.annotations.RealmClass');
      this.fieldsContent += '@RealmClass(embedded = true)\n';
    }
    this.fieldsContent += `open class ${schema.name} : RealmObject() {\n\n`;

    // Properties
    filteredProperties(schema.properties).forEach(prop => {
      this.propertyLine(prop, schema.primaryKey);
      if (prop.indexed && prop.name !== schema.primaryKey) {
        this.realmImports.add('import io.realm.annotations.Index');
      }
      if (
        !prop.optional &&
        prop.type === 'list' &&
        isPrimitive(prop.objectType)
      ) {
        this.realmImports.add('import io.realm.annotations.Required');
      }
    });

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
    if (
      !prop.optional &&
      prop.type === 'list' &&
      isPrimitive(prop.objectType)
    ) {
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
        case 'object id':
        case 'objectId':
          return `${prefix} ObjectId()`;
        case 'decimal':
        case 'decimal128':
          return `${prefix} Decimal128()`;
        case 'list':
          return `${prefix} RealmList()`;
      }
    }

    return '';
  }

  private kotlinTypeForProperty(property: any): any {
    let propertyType = null;

    if (property.type === 'list') {
      this.realmImports.add('import io.realm.RealmList');
      switch (property.objectType) {
        case 'bool':
          propertyType = 'RealmList<Boolean>';
          break;
        case 'int':
          propertyType = 'RealmList<Long>';
          break;
        case 'float':
          propertyType = 'RealmList<Float>';
          break;
        case 'double':
          propertyType = 'RealmList<Double>';
          break;
        case 'string':
          propertyType = 'RealmList<String>';
          break;
        case 'data':
          propertyType = 'RealmList<ByteArray>';
          break;
        case 'date':
          this.realmImports.add('import java.util.Date');
          propertyType = 'RealmList<Date>';
          break;
        case 'object id':
        case 'objectId':
          propertyType = 'RealmList<ObjectId>';
          break;
        case 'decimal':
        case 'decimal128':
          propertyType = 'RealmList<Decimal128>';
          break;
        default:
          propertyType = `RealmList<${property.objectType}>`;
          break;
      }
    } else {
      switch (property.type) {
        case 'bool':
          propertyType = 'Boolean';
          break;
        case 'int':
          propertyType = 'Long';
          break;
        case 'float':
          propertyType = 'Float';
          break;
        case 'double':
          propertyType = 'Double';
          break;
        case 'string':
          propertyType = 'String';
          break;
        case 'data':
          propertyType = 'ByteArray';
          break;
        case 'date':
          this.realmImports.add('import java.util.Date');
          propertyType = 'Date';
          break;
        case 'object id':
        case 'objectId':
          propertyType = 'ObjectId';
          break;
        case 'decimal':
        case 'decimal128':
          propertyType = 'Decimal128';
          break;
        case 'object':
          propertyType = property.objectType;
          break;
      }
    }

    if (property.optional) {
      propertyType += '?';
    }

    return propertyType;
  }
}
