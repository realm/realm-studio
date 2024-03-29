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

export default class JavaSchemaExporter extends SchemaExporter {
  private static readonly PADDING = '    ';

  private fieldsContent = '';
  private gettersSetterContent = '';
  private realmImports: Set<string>;

  constructor() {
    super();
    this.fieldsContent = '';
    this.gettersSetterContent = '';
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
    this.appendLine('package your.package.name.here;');
    this.appendLine('');

    this.realmImports.add('import io.realm.RealmObject;');

    if (schema.embedded) {
      this.realmImports.add('import io.realm.annotations.RealmClass;');
      this.fieldsContent += '@RealmClass(embedded = true)\n';
    }
    this.fieldsContent += `public class ${schema.name} extends RealmObject {\n`;

    // Properties
    filteredProperties(schema.properties).forEach(prop => {
      this.propertyLine(prop, schema.primaryKey);
      if (prop.indexed && prop.name !== schema.primaryKey) {
        this.realmImports.add('import io.realm.annotations.Index;');
      }

      if (!prop.optional && this.javaPropertyTypeCanBeMarkedRequired(prop)) {
        this.realmImports.add('import io.realm.annotations.Required;');
      }
    });

    // Primary key
    if (schema.primaryKey) {
      this.realmImports.add('import io.realm.annotations.PrimaryKey;');
    }

    // Add all Realm imports
    this.realmImports.forEach(line => {
      this.appendLine(line);
    });
    this.appendLine('');

    // Add class body
    this.appendLine(this.fieldsContent);

    // Add getters and setters
    this.appendLine(this.gettersSetterContent);

    // End class
    this.appendLine('}');

    this.addFile(schema.name + '.java', this.content);

    // reset content for next Schema
    this.content = '';
    this.fieldsContent = '';
    this.gettersSetterContent = '';
    this.realmImports.clear();
  }

  private propertyLine(prop: any, primaryKey: string | undefined): void {
    if (prop.name === primaryKey) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@PrimaryKey\n`;
    } else if (prop.indexed) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@Index\n`;
    }
    if (!prop.optional && this.javaPropertyTypeCanBeMarkedRequired(prop)) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@Required\n`;
    }

    this.fieldsContent += `${
      JavaSchemaExporter.PADDING
    }private ${this.javaNameForProperty(prop)} ${prop.name};\n`;

    this.gettersSetterContent += `${
      JavaSchemaExporter.PADDING
    }public ${this.javaNameForProperty(prop)} ${
      prop.type === 'bool' ? 'is' : 'get'
    }${this.capitalizedString(prop.name)}() { return ${prop.name}; }\n\n`;

    this.gettersSetterContent += `${
      JavaSchemaExporter.PADDING
    }public void set${this.capitalizedString(
      prop.name,
    )}(${this.javaNameForProperty(prop)} ${prop.name}) { this.${prop.name} = ${
      prop.name
    }; }\n\n`;
  }

  private javaPropertyTypeCanBeMarkedRequired(
    property: Realm.ObjectSchemaProperty,
  ): boolean {
    switch (property.type) {
      case 'bool':
      case 'int':
      case 'float':
      case 'double':
      case 'object':
        return false;
      case 'string':
      case 'data':
      case 'date':
      case 'objectId':
      case 'decimal128':
        return true;
      case 'list':
        return isPrimitive(property.objectType);
    }
    return false;
  }

  private javaNameForProperty(property: any): any {
    if (property.type === 'list') {
      this.realmImports.add('import io.realm.RealmList;');
      switch (property.objectType) {
        case 'bool':
          return 'RealmList<Boolean>';
        case 'int':
          return 'RealmList<Long>';
        case 'float':
          return 'RealmList<Float>';
        case 'double':
          return 'RealmList<Double>';
        case 'string':
          return 'RealmList<String>';
        case 'data':
          return 'RealmList<byte[]>';
        case 'date':
          this.realmImports.add('import java.util.Date;');
          return 'RealmList<Date>';
        case 'object id':
        case 'objectId':
          this.realmImports.add('import org.bson.types.ObjectId;');
          return 'RealmList<ObjectId>';
        case 'decimal':
        case 'decimal128':
          this.realmImports.add('import org.bson.types.Decimal128;');
          return 'RealmList<Decimal128>';
        default:
          return `RealmList<${property.objectType}>`;
      }
    }
    switch (property.type) {
      case 'bool':
        return property.optional ? 'Boolean' : 'boolean';
      case 'int':
        return property.optional ? 'Long' : 'long';
      case 'float':
        return property.optional ? 'Float' : 'float';
      case 'double':
        return property.optional ? 'Double' : 'double';
      case 'string':
        return 'String';
      case 'data':
        return 'byte[]';
      case 'date':
        this.realmImports.add('import java.util.Date;');
        return 'Date';
      case 'objectId':
        this.realmImports.add('import org.bson.types.ObjectId;');
        return 'ObjectId';
      case 'decimal128':
        this.realmImports.add('import org.bson.types.Decimal128;');
        return 'Decimal128';
      case 'object':
        return property.objectType;
    }
    return null;
  }
}
